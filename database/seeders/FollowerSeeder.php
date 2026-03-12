<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FollowerSeeder extends Seeder
{
    public function run(): void
    {
        $userIds  = DB::table('users')->pluck('id')->toArray();
        $forumIds = DB::table('forums')->pluck('id')->toArray();

        // Cada usuario sigue varios foros (sin repetir combinaciones)
        $followers = [
            // User 0 sigue foros 1, 2, 3
            [
                'id'         => Str::uuid(),
                'user_id'    => $userIds[0],
                'forum_id'   => $forumIds[1],
                'created_at' => now()->subDays(12),
                'updated_at' => now()->subDays(12),
            ],
            [
                'id'         => Str::uuid(),
                'user_id'    => $userIds[0],
                'forum_id'   => $forumIds[2],
                'created_at' => now()->subDays(11),
                'updated_at' => now()->subDays(11),
            ],
            [
                'id'         => Str::uuid(),
                'user_id'    => $userIds[0],
                'forum_id'   => $forumIds[3],
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(10),
            ],
            // User 1 sigue foros 0, 2, 4
            [
                'id'         => Str::uuid(),
                'user_id'    => $userIds[1],
                'forum_id'   => $forumIds[0],
                'created_at' => now()->subDays(9),
                'updated_at' => now()->subDays(9),
            ],
            [
                'id'         => Str::uuid(),
                'user_id'    => $userIds[1],
                'forum_id'   => $forumIds[2],
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(8),
            ],
            [
                'id'         => Str::uuid(),
                'user_id'    => $userIds[1],
                'forum_id'   => $forumIds[4],
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ],
            // User 2 sigue foros 0, 1, 4
            [
                'id'         => Str::uuid(),
                'user_id'    => $userIds[2],
                'forum_id'   => $forumIds[0],
                'created_at' => now()->subDays(6),
                'updated_at' => now()->subDays(6),
            ],
            [
                'id'         => Str::uuid(),
                'user_id'    => $userIds[2],
                'forum_id'   => $forumIds[1],
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'id'         => Str::uuid(),
                'user_id'    => $userIds[2],
                'forum_id'   => $forumIds[4],
                'created_at' => now()->subDays(4),
                'updated_at' => now()->subDays(4),
            ],
            // User 3 sigue foros 0, 2
            [
                'id'         => Str::uuid(),
                'user_id'    => $userIds[3],
                'forum_id'   => $forumIds[0],
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'id'         => Str::uuid(),
                'user_id'    => $userIds[3],
                'forum_id'   => $forumIds[2],
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            // User 4 sigue foros 1, 3
            [
                'id'         => Str::uuid(),
                'user_id'    => $userIds[4],
                'forum_id'   => $forumIds[1],
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            [
                'id'         => Str::uuid(),
                'user_id'    => $userIds[4],
                'forum_id'   => $forumIds[3],
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('followers')->insert($followers);
    }
}