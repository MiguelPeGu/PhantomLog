<?php

declare(strict_types=1);

use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Route;

Route::get('/', fn (): View => view('welcome'));

Route::get('/logout-redirect', function () {
    auth()->logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();

    return redirect('http://localhost:5173');
})->name('logout.redirect');
