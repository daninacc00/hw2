<?php
// app/Http/Controllers/OrderController.php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $userId = session('user_id');

        if (!$userId) {
            return redirect('/login');
        }

        // Recupera ordini dell'utente con conteggio items
        $orders = Order::where('user_id', $userId)
            ->withCount('orderItems as items_count')
            ->orderBy('created_at', 'desc')
            ->get();

        return view('account.orders', compact('orders'));
    }

    public function getOrderItems(Request $request): JsonResponse
    {
        $userId = session('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Utente non autenticato'
            ]);
        }

        $orderId = $request->get('order_id');

        if (!$orderId || !is_numeric($orderId)) {
            return response()->json([
                'success' => false,
                'message' => 'ID ordine non valido'
            ]);
        }

        try {
            // Verifica che l'ordine appartenga all'utente
            $order = Order::where('id', $orderId)
                ->where('user_id', $userId)
                ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ordine non trovato'
                ]);
            }

            // Recupera i prodotti dell'ordine con tutti i dettagli
            $items = DB::select("
                SELECT 
                    oi.quantity,
                    oi.price,
                    p.name as product_name,
                    p.description,
                    c.name as color_name,
                    s.value as size_name,
                    pi.image_url
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                LEFT JOIN colors c ON oi.color_id = c.id
                LEFT JOIN sizes s ON oi.size_id = s.id
                LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
                WHERE oi.order_id = ?
                ORDER BY oi.id
            ", [$orderId]);

            return response()->json([
                'success' => true,
                'items' => $items,
                'message' => 'Prodotti caricati con successo'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore durante il caricamento: ' . $e->getMessage()
            ]);
        }
    }
}