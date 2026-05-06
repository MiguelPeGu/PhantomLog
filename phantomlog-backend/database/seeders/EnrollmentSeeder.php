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

        if ($users->isEmpty() || $expeditions->isEmpty()) {
            return;
        }

        $pairs = [
            [$users[1] ?? null, $expeditions[0] ?? null],
            [$users[2] ?? null, $expeditions[0] ?? null],
            [$users[0] ?? null, $expeditions[1] ?? null],
            [$users[3] ?? null, $expeditions[1] ?? null],
            [$users[0] ?? null, $expeditions[2] ?? null],
            [$users[4] ?? null, $expeditions[2] ?? null],
            [$users[1] ?? null, $expeditions[3] ?? null],
            [$users[2] ?? null, $expeditions[3] ?? null],
            [$users[0] ?? null, $expeditions[4] ?? null],
            [$users[3] ?? null, $expeditions[4] ?? null],
        ];

        foreach ($pairs as [$user, $expedition]) {
            if ($user instanceof User && $expedition instanceof Expedition) {
                $user->joinedExpeditions()->attach($expedition->id);
            }
        }
    }
}
