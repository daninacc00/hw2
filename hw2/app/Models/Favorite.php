<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $table = 'favorites';
    
    protected $fillable = [
        'user_id',
        'product_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function addProduct($userId, $productId)
    {
        if (!$userId || !$productId) {
            return [
                'success' => false,
                'message' => 'ID utente o prodotto non valido'
            ];
        }

        $product = Product::find($productId);
        if (!$product) {
            return [
                'success' => false,
                'message' => 'Prodotto non trovato'
            ];
        }

        if ($this->isProductInUserFavorites($userId, $productId)) {
            return [
                'success' => false,
                'message' => 'Prodotto già presente nei preferiti'
            ];
        }

        $favorite = new Favorite();
        $favorite->user_id = $userId;
        $favorite->product_id = $productId;

        if ($favorite->save()) {
            return [
                'success' => true,
                'message' => 'Prodotto aggiunto ai preferiti',
                'data' => [
                    'product_name' => $product->name
                ]
            ];
        }

        return [
            'success' => false,
            'message' => "Errore durante l'inserimento del prodotto nei preferiti",
        ];
    }

    public function removeProduct($userId, $productId)
    {
        if (!$userId || !$productId) {
            return [
                'success' => false,
                'message' => 'ID utente o prodotto non valido'
            ];
        }

        $favorite = Favorite::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if (!$favorite) {
            return [
                'success' => false,
                'message' => 'Prodotto non trovato nei preferiti'
            ];
        }

        if ($favorite->delete()) {
            return [
                'success' => true,
                'message' => 'Prodotto rimosso dai preferiti'
            ];
        }

        return [
            'success' => false,
            'message' => 'Errore nella rimozione del prodotto dai preferiti'
        ];
    }

    public function getUserFavorites($userId)
    {
        if (!$userId) {
            return [
                'success' => false,
                'message' => 'ID utente non valido'
            ];
        }

        $favorites = Favorite::with(['product.primaryImage', 'product.section', 'product.category'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        $favoriteData = [];
        foreach ($favorites as $favorite) {
            $product = $favorite->product;
            if ($product) {
                $isInCart = Cart::where('product_id', $product->id)
                    ->where('user_id', $userId)
                    ->exists();

                $favoriteData[] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'section_name' => $product->section ? $product->section->display_name : '',
                    'category_name' => $product->category ? $product->category->display_name : '',
                    'price' => $product->price,
                    'image_url' => $product->primaryImage ? $product->primaryImage->image_url : '',
                    'isInCart' => $isInCart,
                    'added_date' => $favorite->created_at
                ];
            }
        }

        return [
            'success' => true,
            'message' => 'Preferiti recuperati con successo',
            'data' => $favoriteData
        ];
    }

    public function isProductFavorite($userId, $productId)
    {
        if (!$userId || !$productId) {
            return ['success' => false, 'is_favorite' => false];
        }

        $isFavorite = $this->isProductInUserFavorites($userId, $productId);

        return [
            'success' => true,
            'is_favorite' => $isFavorite
        ];
    }

    public function isProductInUserFavorites($userId, $productId)
    {
        if (!$userId) {
            return false;
        }

        return Favorite::where('user_id', $userId)
            ->where('product_id', $productId)
            ->exists();
    }

    public function getNumOfFavorites($userId)
    {
        return Favorite::where('user_id', $userId)->count();
    }
}