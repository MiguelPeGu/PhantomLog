<?php

namespace Database\Seeders;

use App\Models\Forum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FollowerSeeder extends Seeder
{
    public function run(): void
    {
        $users  = User::all();
        $forums = Forum::all();


        $pairs = [
            [$users[0], $forums[1]],
            [$users[0], $forums[2]],
            [$users[0], $forums[3]],
            [$users[1], $forums[0]],
            [$users[1], $forums[2]],
            [$users[1], $forums[4]],
            [$users[2], $forums[0]],
            [$users[2], $forums[1]],
            [$users[2], $forums[4]],
            [$users[3], $forums[0]],
            [$users[3], $forums[2]],
            [$users[4], $forums[1]],
            [$users[4], $forums[3]],
        ];

        foreach ($pairs as [$user, $forum]) {
            $user->followedForums()->attach($forum->id, ['id' => Str::uuid()]);
        }
    }
}