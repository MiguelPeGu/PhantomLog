<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

final class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Creamos los 30 productos únicos que corresponden a las 30 imágenes
        Product::factory()->count(30)->create();
    }
}
