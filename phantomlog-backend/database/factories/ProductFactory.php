<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
final class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $products = [
            ['title' => 'Sensor EMF K-II Pro', 'desc' => 'Detector de campos electromagnéticos de alta sensibilidad.', 'img' => 'emf_k2.jpg'],
            ['title' => 'Spirit Box SB7-V2', 'desc' => 'Radio de barrido de frecuencia ultra-rápido.', 'img' => 'ghost_box_bt.jpg'],
            ['title' => 'Cámara Térmica FLIR Ghost', 'desc' => 'Visualiza variaciones térmicas de hasta 0.01°C.', 'img' => 'thermal_cam.jpg'],
            ['title' => 'Sal Bendita del Vaticano', 'desc' => 'Contenedor de 500g de sal marina pura.', 'img' => 'salt.jpg'],
            ['title' => 'Grabadora Digital de EVP', 'desc' => 'Filtro de ruido blanco avanzado.', 'img' => 'evp_recorder.jpg'],
            ['title' => 'Lámpara UV de Espectro Completo', 'desc' => 'Revela rastros de ectoplasma.', 'img' => 'uv_light.jpg'],
            ['title' => 'Incienso de Sándalo Antiguo', 'desc' => 'Pack de 20 varillas para purificación.', 'img' => 'sage.jpg'],
            ['title' => 'Crucifijo de Plata de Ley', 'desc' => 'Reliquia de protección personal.', 'img' => 'cross.jpg'],
            ['title' => 'Sensor de Movimiento Láser', 'desc' => 'Crea una red de seguridad invisible.', 'img' => 'motion_ir.jpg'],
            ['title' => 'Péndulo de Cuarzo Amatista', 'desc' => 'Herramienta de radiestesia.', 'img' => 'candles.jpg'],
        ];

        /** @var array{title: string, desc: string, img: string} $product */
        $product = $this->faker->randomElement($products);

        return [
            'id' => (string) Str::uuid(),
            'sku' => 'PL-'.mb_strtoupper($this->faker->bothify('####-####')),
            'title' => $product['title'],
            'provider' => $this->faker->randomElement(['Arcane Industries', 'Specter Tech', 'Vatican Supplies', 'GhostGear Pro']),
            'price' => $this->faker->randomFloat(2, 20, 1500),
            'tax' => 21,
            'stock' => $this->faker->numberBetween(5, 50),
            'image' => 'images/products/'.$product['img'],
            'description' => $product['desc'],
        ];
    }
}
