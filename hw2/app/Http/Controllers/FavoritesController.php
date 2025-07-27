<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\Product;

class FavoritesController extends Controller
{
    public function index()
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

        $favorite = new Favorite();
        $result = $favorite->getUserFavorites($userId);

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

        $favorite = new Favorite();
        $result = $favorite->addProduct($userId, $productId);

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

        $favorite = new Favorite();
        $result = $favorite->removeProduct($userId, $productId);

        return response()->json($result);
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

    public function getFavoritesCount(Request $request)
    {
        $userId = session('user_id');

        if (!$userId) {
            return response()->json([
                'success' => true,
                'count' => 0
            ]);
        }

        $favorite = new Favorite();
        $count = $favorite->getNumOfFavorites($userId);

        return response()->json([
            'success' => true,
            'count' => $count
        ]);
    }
}
