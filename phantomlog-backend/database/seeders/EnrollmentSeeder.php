<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Expedition;
use App\Models\User;
use Illuminate\Database\Seeder;

final class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $expeditions = Expedition::all();

        $pairs = [
            [$users[1], $expeditions[0]],
            [$users[2], $expeditions[0]],
            [$users[0], $expeditions[1]],
            [$users[3], $expeditions[1]],
            [$users[0], $expeditions[2]],
            [$users[4], $expeditions[2]],
            [$users[1], $expeditions[3]],
            [$users[2], $expeditions[3]],
            [$users[0], $expeditions[4]],
            [$users[3], $expeditions[4]],
        ];

        foreach ($pairs as [$user, $expedition]) {
            $user->joinedExpeditions()->attach($expedition->id);
        }
    }
}
