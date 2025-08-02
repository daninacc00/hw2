<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function checkout()
    {
        $userId = session('user_id');
        
        if (!$userId) {
            return redirect('/login');
        }

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

        $total = 0;
        foreach ($cartItems as $item) {
            $total += $item->price * $item->quantity;
        }

        return view('checkout', compact('cartItems', 'total'));
    }

    public function processPayment(Request $request)
    {
        $userId = session('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Utente non autenticato'
            ]);
        }

        $payment_token = $request->input('payment_token');
        $billing_name = $request->input('billing_name');
        $billing_email = $request->input('billing_email');
        $billing_address = $request->input('billing_address');

        if (empty($payment_token) || empty($billing_name) || empty($billing_email) || empty($billing_address)) {
            return response()->json([
                'success' => false,
                'message' => 'Dati mancanti'
            ]);
        }

        if (!filter_var($billing_email, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'success' => false,
                'message' => 'Email non valida'
            ]);
        }

        try {
            $cartItems = DB::select("
                SELECT c.*, p.price 
                FROM cart c 
                JOIN products p ON c.product_id = p.id 
                WHERE c.user_id = ?
            ", [$userId]);

            if (empty($cartItems)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Carrello vuoto'
                ]);
            }

            $total = 0;
            foreach ($cartItems as $item) {
                $total += $item->price * $item->quantity;
            }

            $squareResult = $this->processSquarePayment($payment_token, $total, $billing_name, $billing_email);

            if (!$squareResult['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $squareResult['message']
                ]);
            }

            $order = Order::create([
                'user_id' => $userId,
                'square_order_id' => $squareResult['order_id'],
                'status' => 'paid',
                'total_amount' => $total,
                'billing_name' => $billing_name,
                'billing_email' => $billing_email,
                'billing_address' => $billing_address
            ]);

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

            DB::delete("DELETE FROM cart WHERE user_id = ?", [$userId]);

            return response()->json([
                'success' => true,
                'message' => 'Ordine completato con successo',
                'order_id' => $order->id
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore durante l\'elaborazione'
            ]);
        }
    }

    private function processSquarePayment(string $paymentToken, float $amount, string $billingName, string $billingEmail): array
    {
        $squareAccessToken = env('SQUARE_SANDBOX_ACCESS_TOKEN', null);
        $squareLocationId = env('SQUARE_SANDBOX_LOCATION_ID', null);

        if(!isset($squareAccessToken) || !isset($squareLocationId)){
             return [
                'success' => false,
                'message' => 'Dati non validi'
            ];
        }

        $url = 'https://connect.squareupsandbox.com/v2/payments';

        $paymentData = [
            'source_id' => $paymentToken,
            'amount_money' => [
                'amount' => (int)($amount * 100),
                'currency' => 'USD'
            ],
            'location_id' => $squareLocationId,
            'idempotency_key' => uniqid(),
            'note' => 'Ordine Nike Store - ' . $billingName
        ];

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
        curl_close($curl);

        if ($httpCode !== 200) {
            return [
                'success' => false,
                'message' => 'Errore Square API'
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
            return [
                'success' => false,
                'message' => 'Pagamento fallito'
            ];
        }
    }
}