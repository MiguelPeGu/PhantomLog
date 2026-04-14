<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
final class UserFactory extends Factory
{
    private static ?string $password = null;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'dni' => $this->faker->unique()->regexify('[0-9]{8}[A-Z]'),
            'username' => $this->faker->unique()->userName(),
            'img' => 'https://api.dicebear.com/9.x/lorelei/svg?seed='.$this->faker->firstName(),
            'firstname' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
            'address' => $this->faker->address(),
            'postalCode' => $this->faker->postcode(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => bcrypt('password'), 
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): self
    {
        return $this->state(fn (array $attributes): array => [
            'email_verified_at' => null,
        ]);
    }
}
