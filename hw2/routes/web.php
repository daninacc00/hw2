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

// Route pubbliche per autenticazione
Route::get('/', [HomeController::class, 'index']);
Route::get('/slider-images', [HomeController::class, 'getSliderImages']);

Route::get('/login', [AuthController::class, 'showLogin']);
Route::get('/register', [AuthController::class, 'showRegister']);

// Route POST per autenticazione (DEVONO essere pubbliche)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/shop', [ShopController::class, 'index'])->name('shop');
Route::get('/api/shop/products', [ShopController::class, 'getProducts']);
Route::get('/api/shop/product', [ShopController::class, 'getProduct']);

Route::get('/product/{id}', [ProductController::class, 'show'])->where('id', '[0-9]+');
Route::get('/api/product', [ProductController::class, 'getProductData']); // Come nell'HW1: /api/product?id=1

// Route protette da middleware di autenticazione
Route::middleware(AuthMiddleware::class)->group(function () {
    Route::get('/profile', function () {
        return view('profile');
    });

    Route::get('/dashboard', function () {
        return view('dashboard');
    });

    Route::get('/logout', [AuthController::class, 'logout']);

    Route::get('/api/user/profile', [UserController::class, 'getProfile']);

    // Account routes
    Route::get('/account', [AccountController::class, 'index']);
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
    Route::get('/account/favorites', [FavoritesController::class, 'index']);
    Route::get('/api/favorites/get', [FavoritesController::class, 'getFavorites']);
    Route::post('/api/favorites/add', [FavoritesController::class, 'addToFavorites']);
    Route::post('/api/favorites/remove', [FavoritesController::class, 'removeFromFavorites']);
    Route::get('/api/favorites/product', [FavoritesController::class, 'getProduct']);

    // Cart routes
    Route::get('/account/cart', [CartController::class, 'index']);
    Route::get('/api/cart/get', [CartController::class, 'getCart']);
    Route::post('/api/cart/add', [CartController::class, 'addToCart']);
    Route::post('/api/cart/update', [CartController::class, 'updateQuantity']);
    Route::post('/api/cart/remove-item', [CartController::class, 'removeCartItem']);
    Route::post('/api/cart/remove', [CartController::class, 'removeFromCart']);
});
