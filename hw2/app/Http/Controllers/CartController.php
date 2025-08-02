<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index()
    {
        return view('account.cart');
    }

    public function getCart(Request $request)
    {
        $userId = session('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => "Devi essere loggato per accedere al tuo carrello",
                'error_type' => 'auth_required',
                'redirect_url' => '/login',
                'data' => []
            ]);
        }

        try {
            $cartItems = DB::select("
                SELECT 
                    c.id as cart_item_id,
                    c.quantity,
                    c.created_at as added_date,
                    p.id as product_id,
                    p.name as product_name,
                    p.price,
                    p.original_price,
                    p.discount_percentage,
                    s.display_name AS section_name,
                    cat.display_name AS category_name,
                    col.name as color_name,
                    col.hex_code as color_hex,
                    sz.value as size_value,
                    sz.type as size_type,
                    pi.image_url as product_image,
                    ps.stock_quantity as available_stock
                FROM cart AS c 
                LEFT JOIN products AS p ON c.product_id = p.id 
                LEFT JOIN product_images AS pi ON p.id = pi.product_id AND pi.is_primary = 1
                LEFT JOIN sections AS s ON p.section_id = s.id
                LEFT JOIN categories AS cat ON p.category_id = cat.id
                LEFT JOIN colors AS col ON c.color_id = col.id
                LEFT JOIN sizes AS sz ON c.size_id = sz.id
                LEFT JOIN product_sizes AS ps ON p.id = ps.product_id AND c.size_id = ps.size_id
                WHERE c.user_id = ?
                ORDER BY c.created_at DESC
            ", [$userId]);

            $subtotal = 0;
            foreach ($cartItems as $item) {
                $subtotal += $item->price * $item->quantity;
            }

            $shippingCost = $subtotal >= 50 ? 0 : 5.99;
            $total = $subtotal + $shippingCost;

            $summary = [
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'items_count' => count($cartItems)
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'items' => $cartItems,
                    'summary' => $summary
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore nel caricamento del carrello'
            ]);
        }
    }

    public function addToCart(Request $request)
    {
        $userId = session('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => "Devi essere loggato per accedere al tuo carrello",
                'error_type' => 'auth_required',
                'redirect_url' => '/login',
                'data' => []
            ]);
        }

        $productId = $request->input('productId');
        $colorId = $request->input('colorId');
        $sizeId = $request->input('sizeId');
        $quantity = $request->input('quantity', 1);

        if (!$productId || !$colorId || !$sizeId || $quantity <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Dati mancanti o non validi'
            ]);
        }

        try {
            $product = DB::select("
                SELECT p.*, ps.stock_quantity 
                FROM products p
                LEFT JOIN product_sizes ps ON p.id = ps.product_id AND ps.size_id = ?
                WHERE p.id = ?
            ", [$sizeId, $productId]);

            if (empty($product)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Prodotto non trovato'
                ]);
            }

            $product = $product[0];

            if ($product->stock_quantity < $quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Quantità richiesta non disponibile'
                ]);
            }

            $existingItem = DB::select("
                SELECT id, quantity 
                FROM cart 
                WHERE user_id = ? AND product_id = ? AND size_id = ? AND color_id = ?
            ", [$userId, $productId, $sizeId, $colorId]);

            if (!empty($existingItem)) {
                $existingItem = $existingItem[0];
                $newQuantity = $existingItem->quantity + $quantity;
                
                if ($newQuantity > $product->stock_quantity) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Quantità totale richiesta non disponibile'
                    ]);
                }

                DB::update("
                    UPDATE cart 
                    SET quantity = ?, updated_at = NOW() 
                    WHERE id = ?
                ", [$newQuantity, $existingItem->id]);
            } else {
                DB::insert("
                    INSERT INTO cart (user_id, product_id, color_id, size_id, quantity, created_at, updated_at) 
                    VALUES (?, ?, ?, ?, ?, NOW(), NOW())
                ", [$userId, $productId, $colorId, $sizeId, $quantity]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Prodotto aggiunto al carrello'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore durante l\'aggiunta al carrello'
            ]);
        }
    }

    public function updateQuantity(Request $request)
    {
        $userId = session('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => "Devi essere loggato per accedere al tuo carrello"
            ]);
        }

        $cartItemId = $request->input('cartItemId');
        $quantity = $request->input('quantity');

        if (!$cartItemId || !$quantity || $quantity <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Dati mancanti o non validi'
            ]);
        }

        try {
            $cartItem = DB::select("
                SELECT c.id, c.quantity, ps.stock_quantity
                FROM cart c
                LEFT JOIN product_sizes ps ON c.product_id = ps.product_id AND c.size_id = ps.size_id
                WHERE c.id = ? AND c.user_id = ?
            ", [$cartItemId, $userId]);

            if (empty($cartItem)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Elemento carrello non trovato'
                ]);
            }

            $cartItem = $cartItem[0];

            if ($quantity > $cartItem->stock_quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Quantità richiesta non disponibile in magazzino'
                ]);
            }

            DB::update("
                UPDATE cart 
                SET quantity = ?, updated_at = NOW() 
                WHERE id = ?
            ", [$quantity, $cartItemId]);

            return response()->json([
                'success' => true,
                'message' => 'Quantità aggiornata con successo'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore durante l\'aggiornamento'
            ]);
        }
    }

    public function removeCartItem(Request $request)
    {
        $userId = session('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => "Devi essere loggato per accedere al tuo carrello"
            ]);
        }

        $cartItemId = $request->input('cartItemId');

        if (!$cartItemId) {
            return response()->json([
                'success' => false,
                'message' => 'ID elemento carrello mancante'
            ]);
        }

        try {
            $deleted = DB::delete("
                DELETE FROM cart 
                WHERE id = ? AND user_id = ?
            ", [$cartItemId, $userId]);

            if ($deleted) {
                return response()->json([
                    'success' => true,
                    'message' => 'Elemento rimosso dal carrello'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Elemento carrello non trovato'
                ]);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore durante la rimozione'
            ]);
        }
    }
}