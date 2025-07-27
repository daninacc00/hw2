<?php

use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InterestController;

// Route pubbliche per autenticazione
Route::get('/', [HomeController::class, 'index']);
Route::get('/login', [AuthController::class, 'showLogin']);
Route::get('/register', [AuthController::class, 'showRegister']);

// Route POST per autenticazione (DEVONO essere pubbliche)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Route protette da middleware di autenticazione
Route::middleware(AuthMiddleware::class)->group(function () {
    Route::get('/profile', function () {
        return view('profile');
    });
    
    Route::get('/dashboard', function () {
        return view('dashboard');
    });
    
    Route::get('/logout', [AuthController::class, 'logout']);

    Route::get('/account', [AccountController::class, 'index']);
    Route::get('/api/account/profile', [AccountController::class, 'getProfileData']);
    
     Route::get('/api/interests/categories', [InterestController::class, 'getCategories']);
    Route::get('/api/interests', [InterestController::class, 'getInterests']);
    Route::get('/api/interests/user', [InterestController::class, 'getUserInterests']);
    Route::post('/api/interests/toggle', [InterestController::class, 'toggleInterest']);
    // Route::get('/account/profile', [AccountController::class, 'profile']);
    // Route::post('/account/profile', [AccountController::class, 'updateProfile']);
    // Route::get('/account/settings', [AccountController::class, 'settings']);
    // Route::post('/account/settings', [AccountController::class, 'updateSettings']);
});