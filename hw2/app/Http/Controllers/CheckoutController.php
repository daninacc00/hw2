<?php
// app/Http/Controllers/CheckoutController.php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    public function index()
    {
        $userId = session('user_id');
        
        if (!$userId) {
            return redirect('/login');
        }

        // Recupera prodotti nel carrello con dettagli
        $cartItems = DB::select("
            SELECT c.*, p.name, p.price, col.name as color_name, s.value as size_name,
                   pi.image_url
            FROM cart c
            JOIN products p ON c.product_id = p.id
            LEFT JOIN colors col ON c.color_id = col.id
            LEFT JOIN sizes s ON c.size_id = s.id
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
            WHERE c.user_id = ?
        ", [$userId]);

        if (empty($cartItems)) {
            return redirect('/account/cart');
        }

        // Calcola totale
        $total = 0;
        foreach ($cartItems as $item) {
            $total += $item->price * $item->quantity;
        }

        return view('checkout', compact('cartItems', 'total'));
    }

    public function processPayment(Request $request): JsonResponse
    {
        $userId = session('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Utente non autenticato'
            ]);
        }

        // Validazione dati
        $request->validate([
            'payment_token' => 'required|string',
            'billing_name' => 'required|string|max:100',
            'billing_email' => 'required|email|max:100',
            'billing_address' => 'required|string'
        ]);

        try {
            DB::beginTransaction();

            // Recupera carrello utente
            $cartItems = DB::select("
                SELECT c.*, p.price 
                FROM cart c 
                JOIN products p ON c.product_id = p.id 
                WHERE c.user_id = ?
            ", [$userId]);

            if (empty($cartItems)) {
                throw new \Exception('Carrello vuoto');
            }

            // Calcola totale
            $total = 0;
            foreach ($cartItems as $item) {
                $total += $item->price * $item->quantity;
            }

            // Chiama API Square per processare pagamento
            $squareResult = $this->processSquarePayment(
                $request->payment_token,
                $total,
                $request->billing_name,
                $request->billing_email
            );

            if (!$squareResult['success']) {
                throw new \Exception($squareResult['message']);
            }

            // Crea ordine usando Eloquent
            $order = Order::create([
                'user_id' => $userId,
                'square_order_id' => $squareResult['order_id'],
                'status' => 'paid',
                'total_amount' => $total,
                'billing_name' => $request->billing_name,
                'billing_email' => $request->billing_email,
                'billing_address' => $request->billing_address
            ]);

            // Inserisci items dell'ordine
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'color_id' => $item->color_id,
                    'size_id' => $item->size_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price
                ]);
            }

            // Svuota carrello
            DB::delete("DELETE FROM cart WHERE user_id = ?", [$userId]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ordine completato con successo',
                'order_id' => $order->id
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Errore checkout: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Errore durante l\'elaborazione: ' . $e->getMessage()
            ]);
        }
    }

    private function processSquarePayment(string $paymentToken, float $amount, string $billingName, string $billingEmail): array
    {
        // Configurazione Square Sandbox
        $squareAppId = env('SQUARE_SANDBOX_APP_ID', 'sandbox-sq0idb-MVXKt0GG8PPWtdhpsXUAYA');
        $squareAccessToken = env('SQUARE_SANDBOX_ACCESS_TOKEN', 'EAAAl2l9bnFRP2Nwo2tErUg_7KicWhMiqjz3njfJiGk4yr9sCnhpmYUHDMNgvIMm');
        $squareLocationId = env('SQUARE_SANDBOX_LOCATION_ID', 'L00RMZ3RWDTS1');

        // Endpoint Square Sandbox
        $url = 'https://connect.squareupsandbox.com/v2/payments';

        // Dati per Square API
        $paymentData = [
            'source_id' => $paymentToken,
            'amount_money' => [
                'amount' => (int)($amount * 100), // Square usa centesimi
                'currency' => 'USD' // Cambiato da EUR a USD per sandbox
            ],
            'location_id' => $squareLocationId,
            'idempotency_key' => uniqid(),
            'note' => 'Ordine Nike Store - ' . $billingName
        ];

        Log::info('Chiamata Square API', [
            'url' => $url,
            'amount' => $amount,
            'location_id' => $squareLocationId,
            'payment_data' => $paymentData
        ]);

        // Inizializza curl (come mostrato nelle slide)
        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($paymentData),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json',
                'Content-Type: application/json',
                'Authorization: Bearer ' . $squareAccessToken,
                'Square-Version: 2023-10-18'
            ]
        ]);

        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $curlError = curl_error($curl);
        curl_close($curl);

        Log::info('Square API Response', [
            'http_code' => $httpCode,
            'response' => $response,
            'curl_error' => $curlError
        ]);

        if ($curlError) {
            Log::error('cURL Error: ' . $curlError);
            return [
                'success' => false,
                'message' => 'Errore di connessione Square API'
            ];
        }

        if ($httpCode !== 200) {
            Log::error('Square API Error: HTTP ' . $httpCode . ' Response: ' . $response);
            return [
                'success' => false,
                'message' => 'Errore Square API: ' . $httpCode
            ];
        }

        $result = json_decode($response, true);

        if (isset($result['payment']) && $result['payment']['status'] === 'COMPLETED') {
            return [
                'success' => true,
                'order_id' => $result['payment']['id'],
                'message' => 'Pagamento completato'
            ];
        } else {
            $errorMessage = isset($result['errors']) ? $result['errors'][0]['detail'] : 'Pagamento fallito';
            Log::error('Square Payment Failed: ' . $errorMessage, ['result' => $result]);
            return [
                'success' => false,
                'message' => $errorMessage
            ];
        }
    }
}