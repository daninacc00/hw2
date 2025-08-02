<?php

use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InterestController;
use App\Http\Controllers\FavoritesController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;

Route::get('/', [HomeController::class, 'index']);
Route::get('/slider-images', [HomeController::class, 'getSliderImages']);

Route::get('/login', [AuthController::class, 'showLogin']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/shop', [ShopController::class, 'shop']);
Route::get('/api/shop/products', [ShopController::class, 'getProducts']);
Route::get('/api/shop/product', [ShopController::class, 'getProduct']);

Route::get('/product/{id}', [ProductController::class, 'show'])->where('id', '[0-9]+');
Route::get('/api/product', [ProductController::class, 'getProductData']);

Route::middleware(AuthMiddleware::class)->group(function () {
    Route::get('/logout', [AuthController::class, 'logout']);

    Route::get('/api/user/profile', [UserController::class, 'getProfile']);

    Route::get('/account', [AccountController::class, 'profile']);
    Route::get('/account/settings', [AccountController::class, 'settings']);
    Route::get('/api/account/profile', [AccountController::class, 'getProfileData']);
    Route::post('/api/account/settings', [AccountController::class, 'updateSettings']);
    Route::post('/api/account/password', [AccountController::class, 'updatePassword']);

    // Interest routes
    Route::get('/api/interests/categories', [InterestController::class, 'getCategories']);
    Route::get('/api/interests', [InterestController::class, 'getInterests']);
    Route::get('/api/interests/user', [InterestController::class, 'getUserInterests']);
    Route::post('/api/interests/toggle', [InterestController::class, 'toggleInterest']);

    // Favorites routes
    Route::get('/account/favorites', [FavoritesController::class, 'favorites']);
    Route::get('/api/favorites/get', [FavoritesController::class, 'getFavorites']);
    Route::post('/api/favorites/add', [FavoritesController::class, 'addToFavorites']);
    Route::post('/api/favorites/remove', [FavoritesController::class, 'removeFromFavorites']);
    Route::get('/api/favorites/product', [FavoritesController::class, 'getProduct']);

    // Cart routes
    Route::get('/account/cart', [CartController::class, 'cart']);
    Route::get('/api/cart/get', [CartController::class, 'getCart']);
    Route::post('/api/cart/add', [CartController::class, 'addToCart']);
    Route::post('/api/cart/update', [CartController::class, 'updateQuantity']);
    Route::post('/api/cart/remove-item', [CartController::class, 'removeCartItem']);
    Route::post('/api/cart/remove', [CartController::class, 'removeFromCart']);

    // Checkout routes
    Route::get('/checkout', [CheckoutController::class, 'checkout']);
    Route::post('/api/checkout/process', [CheckoutController::class, 'processPayment']);

    // Orders routes  
    Route::get('/account/orders', [OrderController::class, 'orders']);
    Route::get('/api/orders/items', [OrderController::class, 'getOrderItems']);
});
