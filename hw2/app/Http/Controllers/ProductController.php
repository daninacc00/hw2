<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Favorite;

class ProductController extends Controller
{
    public function show(Request $request, $id)
    {
        $product = Product::with([
            'category', 
            'section', 
            'sport', 
            'images' => function($query) {
                $query->orderBy('sort_order');
            }, 
            'colors', 
            'sizes' => function($query) {
                $query->orderBy('sort_order');
            }
        ])
        ->where('id', $id)
        ->where('status', 0)
        ->first();

        if (!$product) {
            abort(404, 'Prodotto non trovato');
        }
        
        return view('product', compact('product'));
    }

    public function getProductData(Request $request)
    {
        $productId = $request->query('id');
        $userId = session('user_id');

        if (!$productId) {
            return response()->json([
                'success' => false,
                'message' => 'ID prodotto mancante'
            ], 400);
        }
        
        $product = Product::with([
            'category', 
            'section', 
            'sport', 
            'images' => function($query) {
                $query->orderBy('sort_order');
            }, 
            'colors', 
            'sizes' => function($query) {
                $query->withPivot('stock_quantity')->orderBy('sort_order');
            }
        ])
        ->where('id', $productId)
        ->where('status', 0)
        ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Prodotto non trovato'
            ], 404);
        }

        $isFavorite = false;
        if ($userId) {
            $isFavorite = Favorite::where('user_id', $userId)
                                 ->where('product_id', $product->id)
                                 ->exists();
        }

        $productData = [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'short_description' => $product->short_description,
            'price' => $product->price,
            'original_price' => $product->original_price,
            'discount_percentage' => $product->discount_percentage,
            'is_bestseller' => $product->is_bestseller,
            'is_new_arrival' => $product->is_new_arrival,
            'is_on_sale' => $product->is_on_sale,
            'rating' => $product->rating,
            'rating_count' => $product->rating_count,
            'shoe_height' => $this->mapShoeHeight($product->shoe_height),
            'category_name' => $product->category ? $product->category->display_name : null,
            'section_name' => $product->section ? $product->section->display_name : null,
            'sport_name' => $product->sport ? $product->sport->display_name : null,
            'is_favorite' => $isFavorite,
            'images' => $product->images->map(function($image) {
                return [
                    'id' => $image->id,
                    'image_url' => $image->image_url,
                    'alt_text' => $image->alt_text,
                    'is_primary' => $image->is_primary,
                    'sort_order' => $image->sort_order
                ];
            }),
            'colors' => $product->colors->map(function($color) {
                return [
                    'id' => $color->id,
                    'name' => $color->name,
                    'hex_code' => $color->hex_code
                ];
            }),
            'sizes' => $product->sizes->map(function($size) {
                return [
                    'id' => $size->id,
                    'value' => $size->value,
                    'type' => $size->type,
                    'stock_quantity' => $size->pivot->stock_quantity ?? 0
                ];
            })
        ];

        return response()->json([
            'success' => true,
            'data' => $productData
        ]);
    }

    private function mapShoeHeight($height)
    {
        $heightMap = [0 => 'low', 1 => 'mid', 2 => 'high'];
        return isset($heightMap[$height]) ? $heightMap[$height] : null;
    }
}