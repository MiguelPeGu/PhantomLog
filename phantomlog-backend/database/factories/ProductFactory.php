<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Product;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $products = [
            ['title' => 'Sensor EMF K-II Pro', 'desc' => 'Detector de campos electromagnéticos de alta sensibilidad. Indispensable para localizar focos de energía paranormal.'],
            ['title' => 'Spirit Box SB7-V2', 'desc' => 'Radio de barrido de frecuencia ultra-rápido para comunicación trans-instrumental en tiempo real.'],
            ['title' => 'Cámara Térmica FLIR Ghost', 'desc' => 'Visualiza variaciones térmicas de hasta 0.01°C. Capta siluetas invisibles al ojo humano.'],
            ['title' => 'Sal Bendita del Vaticano', 'desc' => 'Contenedor de 500g de sal marina pura, ritualizada para protección perimetral contra entidades de clase 4.'],
            ['title' => 'Grabadora Digital de EVP', 'desc' => 'Filtro de ruido blanco avanzado para capturar psicofonías en frecuencias inaudibles.'],
            ['title' => 'Lámpara UV de Espectro Completo', 'desc' => 'Revela rastros de ectoplasma y fluidos residuales invisibles bajo luz convencional.'],
            ['title' => 'Incienso de Sándalo Antiguo', 'desc' => 'Pack de 20 varillas para purificación de ambientes cargados con energía negativa.'],
            ['title' => 'Crucifijo de Plata de Ley', 'desc' => 'Reliquia de protección personal fabricada en plata 925 con inscripciones en latín.'],
            ['title' => 'Sensor de Movimiento Láser', 'desc' => 'Crea una red de seguridad invisible. Emite una alarma sonora al detectar cualquier interrupción física.'],
            ['title' => 'Pendulo de Cuarzo Amatista', 'desc' => 'Herramienta de radiestesia para respuestas binarias en investigaciones de campo.'],
        ];

        $product = $this->faker->randomElement($products);
        $index = array_search($product, $products) + 1;

        return [
            'id' => (string) Str::uuid(),
            'sku' => 'PL-'.strtoupper($this->faker->bothify('####-####')),
            'title' => $product['title'],
            'provider' => $this->faker->randomElement(['Arcane Industries', 'Specter Tech', 'Vatican Supplies', 'GhostGear Pro']),
            'price' => $this->faker->randomFloat(2, 20, 1500),
            'tax' => 21,
            'stock' => $this->faker->numberBetween(5, 50),
            'image' => "images/products/product_{$index}.jpg",
            'description' => $product['desc'],
        ];
    }
}
