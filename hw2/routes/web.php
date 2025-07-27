<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

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
});