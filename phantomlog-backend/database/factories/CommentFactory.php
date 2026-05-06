<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Forum;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Comment>
 */
final class CommentFactory extends Factory
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
            'report_id' => Report::factory(),
            'content' => fake()->sentence(),
            'score' => $this->faker->numberBetween(0, 10),
        ];
    }
}
