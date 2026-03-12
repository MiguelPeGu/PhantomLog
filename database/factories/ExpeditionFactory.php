<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Expedition;
use App\Models\User;
use App\Models\Phantom;

class ExpeditionFactory extends Factory
{
    protected $model = Expedition::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(), 
            'phantom_id' => Phantom::factory(), 
            'name' => $this->faker->unique()->word(),
            'description' => $this->faker->sentence(),
            'location' => $this->faker->city(),
            'date' => $this->faker->dateTime(),
        ];
    }
}