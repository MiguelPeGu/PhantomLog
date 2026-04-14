<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Report;
use App\Models\Forum;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Report>
 */
class ReportFactory extends Factory
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
            'forum_id' => Forum::factory(),
            'user_id' => User::factory(),
            'title' => $this->faker->unique()->sentence(4),
            'description' => $this->faker->paragraph(),
            'image' => $this->faker->boolean(50) ? $this->faker->imageUrl() : null,
            'score' => $this->faker->numberBetween(0, 100),
        ];
    }
}
