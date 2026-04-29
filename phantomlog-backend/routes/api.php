<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ExpeditionController;
use App\Http\Controllers\Api\ForumController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PhantomController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\ReportVoteController;
use Illuminate\Support\Facades\Route;

// Públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',    [AuthController::class, 'me']);
    Route::put('/user',    [AuthController::class, 'update']);

    Route::apiResource('forums',           ForumController::class);
    Route::apiResource('forums.reports',   ReportController::class);
    Route::apiResource('reports.comments', CommentController::class);
    Route::apiResource('expeditions',      ExpeditionController::class);
    Route::apiResource('phantoms',         PhantomController::class);
    Route::apiResource('products',         ProductController::class);
    Route::apiResource('invoices',         InvoiceController::class)->only(['index', 'store', 'show']);

    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/add/{product}', [CartController::class, 'add']);
        Route::post('/subtract/{product}', [CartController::class, 'subtract']);
        Route::delete('/remove/{product}', [CartController::class, 'remove']);
        Route::delete('/clear', [CartController::class, 'clear']);
    });

    // Extras
    Route::post('forums/{forum}/follow',           [ForumController::class,     'toggleFollow']);
    Route::post('expeditions/{expedition}/join',   [ExpeditionController::class, 'toggleJoin']);
    Route::post('reports/{report}/vote',           [ReportVoteController::class, 'vote']);
    Route::get('reports/{report}/vote',            [ReportVoteController::class, 'getVote']);
});