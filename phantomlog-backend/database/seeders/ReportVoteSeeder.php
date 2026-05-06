<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Report;
use App\Models\ReportVote;
use App\Models\User;
use Illuminate\Database\Seeder;

final class ReportVoteSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $reports = Report::all();

        foreach ($reports as $report) {
            // Cada reporte tiene entre 2 y 5 votos aleatorios
            $randomUsers = $users->random(random_int(2, 5));

            foreach ($randomUsers as $user) {
                ReportVote::query()->create([
                    'user_id' => $user->id,
                    'report_id' => $report->id,
                    'value' => random_int(0, 10) > 2 ? 1 : -1, // Más believe que liar
                ]);
            }
        }
    }
}
