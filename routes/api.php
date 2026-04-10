<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ExpeditionController;
use App\Http\Controllers\Api\ForumController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PhantomController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

// Públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',    [AuthController::class, 'me']);

    Route::apiResource('forums',           ForumController::class);
    Route::apiResource('forums.reports',   ReportController::class);
    Route::apiResource('reports.comments', CommentController::class);
    Route::apiResource('expeditions',      ExpeditionController::class);
    Route::apiResource('phantoms',         PhantomController::class);
    Route::apiResource('products',         ProductController::class);
    Route::apiResource('invoices',         InvoiceController::class)->only(['index', 'store', 'show']);

    // Extras
    Route::post('forums/{forum}/follow',           [ForumController::class,     'toggleFollow']);
    Route::post('expeditions/{expedition}/join',   [ExpeditionController::class, 'toggleJoin']);
});