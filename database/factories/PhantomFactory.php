<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Phantom;

class PhantomFactory extends Factory
{
    protected $model = Phantom::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'type' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'location' => $this->faker->city(),
        ];
    }
}