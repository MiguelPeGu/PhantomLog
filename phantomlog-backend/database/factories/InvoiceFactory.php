<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Invoice>
 */
final class InvoiceFactory extends Factory
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
            'n_invoice' => mb_strtoupper($this->faker->bothify('INV###??')),
            'user_id' => User::factory(),
            'dni' => mb_strtoupper($this->faker->bothify('########?')),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'address' => $this->faker->address(),
            'postal_code' => $this->faker->numerify('#####'),
            'tax' => 21,
            'total' => $this->faker->randomFloat(2, 10, 1000),
        ];
    }
}
