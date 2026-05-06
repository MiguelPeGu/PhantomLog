<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Forum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

final class FollowerSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $forums = Forum::all();

        if ($users->isEmpty() || $forums->isEmpty()) {
            return;
        }

        $pairs = [
            [$users[0] ?? null, $forums[1] ?? null],
            [$users[0] ?? null, $forums[2] ?? null],
            [$users[0] ?? null, $forums[3] ?? null],
            [$users[1] ?? null, $forums[0] ?? null],
            [$users[1] ?? null, $forums[2] ?? null],
            [$users[1] ?? null, $forums[4] ?? null],
            [$users[2] ?? null, $forums[0] ?? null],
            [$users[2] ?? null, $forums[1] ?? null],
            [$users[2] ?? null, $forums[4] ?? null],
            [$users[3] ?? null, $forums[0] ?? null],
            [$users[3] ?? null, $forums[2] ?? null],
            [$users[4] ?? null, $forums[1] ?? null],
            [$users[4] ?? null, $forums[3] ?? null],
        ];

        foreach ($pairs as [$user, $forum]) {
            if ($user instanceof User && $forum instanceof Forum) {
                $user->followedForums()->attach($forum->id, ['id' => (string) Str::uuid()]);
            }
        }
    }
}
