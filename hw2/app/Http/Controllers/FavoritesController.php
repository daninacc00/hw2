<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\Product;
use App\Models\Cart;

class FavoritesController extends Controller
{
    public function favorites()
    {
        return view('account.favorites');
    }

    public function getFavorites(Request $request)
    {
        $userId = session('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => "Devi essere loggato per accedere ai tuoi preferiti",
                'error_type' => 'auth_required',
                'redirect_url' => '/login',
                'data' => []
            ]);
        }

        $result = $this->getUserFavorites($userId);

        return response()->json($result);
    }

    public function addToFavorites(Request $request)
    {
        $userId = session('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => "Devi essere loggato per accedere ai tuoi preferiti",
                'error_type' => 'auth_required',
                'redirect_url' => '/login'
            ]);
        }

        $productId = $request->input('productId');

        if (!$productId) {
            return response()->json([
                'success' => false,
                'message' => "ID prodotto mancante"
            ]);
        }

        $result = $this->addProduct($userId, $productId);

        return response()->json($result);
    }

    public function removeFromFavorites(Request $request)
    {
        $userId = session('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => "Devi essere loggato per accedere ai tuoi preferiti",
                'error_type' => 'auth_required',
                'redirect_url' => '/login'
            ]);
        }

        $productId = $request->input('productId');

        if (!$productId) {
            return response()->json([
                'success' => false,
                'message' => "ID prodotto mancante"
            ]);
        }

        $result = $this->removeProduct($userId, $productId);

        return response()->json($result);
    }

    public function getFavoritesCount(Request $request)
    {
        $userId = session('user_id');

        if (!$userId) {
            return response()->json([
                'success' => true,
                'count' => 0
            ]);
        }

        $count = $this->getNumOfFavorites($userId);

        return response()->json([
            'success' => true,
            'count' => $count
        ]);
    }

    public function getProduct(Request $request)
    {
        $productId = $request->query('id');
        $userId = session('user_id');

        if (!$productId) {
            return response()->json([
                'success' => false,
                'message' => 'ID prodotto mancante'
            ]);
        }

        $product = new Product();
        $result = $product->getProductById($productId, $userId);

        return response()->json($result);
    }


    private function isProductInUserFavorites($userId, $productId)
    {
        if (!$userId) {
            return false;
        }

        return Favorite::where('user_id', $userId)
            ->where('product_id', $productId)
            ->exists();
    }

    private function addProduct($userId, $productId)
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

    private function removeProduct($userId, $productId)
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

    private function getUserFavorites($userId)
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
                $primaryImage = $product->images->where('is_primary', true)->first();
                $isInCart = Cart::where('product_id', $product->id)
                    ->where('user_id', $userId)
                    ->exists();

                $favoriteData[] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'section_name' => $product->section ? $product->section->display_name : '',
                    'category_name' => $product->category ? $product->category->display_name : '',
                    'price' => $product->price,
                    'image_url' => $primaryImage ? $primaryImage->image_url : '',
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

    private function getNumOfFavorites($userId)
    {
        return Favorite::where('user_id', $userId)->count();
    }
}