<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController; 
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\GameAccountController;

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Verifikasi Email Route
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware(['signed'])
    ->name('verification.verify');

// Rute Bawaan Sanctum
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rute untuk mengambil data produk dari APIGames
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Rute untuk mengambil produk dari APIGames
    Route::get('/products', [ProductController::class, 'index']);
    
    // Rute untuk memeriksa akun game
    Route::post('/check-account', [GameAccountController::class, 'check']);
});