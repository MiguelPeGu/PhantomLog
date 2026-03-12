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
        return [
            'id' => (string) Str::uuid(),
            'sku' => strtoupper($this->faker->bothify('###########')),
            'title' => $this->faker->word(),
            'provider' => $this->faker->company(),
            'price' => $this->faker->randomFloat(2, 1, 1000),
            'tax' => 21,
            'stock' => $this->faker->numberBetween(0, 100),
            'image' => $this->faker->imageUrl(),
            'description' => $this->faker->sentence(),
        ];
    }
}
