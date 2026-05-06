<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Forum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Follower>
 */
final class FollowerFactory extends Factory
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
            'user_id' => User::query()->first()?->id ?? User::factory(),
            'forum_id' => Forum::query()->first()?->id ?? Forum::factory(),
        ];
    }
}
