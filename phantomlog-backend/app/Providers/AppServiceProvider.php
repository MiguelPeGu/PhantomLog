<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        \Filament\Notifications\Livewire\Notifications::alignment(\Filament\Support\Enums\Alignment::Center);
        \Filament\Notifications\Livewire\Notifications::verticalAlignment(\Filament\Support\Enums\VerticalAlignment::End);
    }
}
