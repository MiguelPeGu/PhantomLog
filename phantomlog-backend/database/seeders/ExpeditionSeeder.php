<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Expedition;
use App\Models\Phantom;
use App\Models\User;
use Illuminate\Database\Seeder;

final class ExpeditionSeeder extends Seeder
{
    public function run(): void
    {
        // Creamos 15 expediciones usando la variedad del Factory unificado
        Expedition::factory()->count(15)->create();
    }
}
