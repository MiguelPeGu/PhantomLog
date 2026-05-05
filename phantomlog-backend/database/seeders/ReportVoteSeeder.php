<?php

namespace Database\Seeders;

use App\Models\Report;
use App\Models\User;
use App\Models\ReportVote;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ReportVoteSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $reports = Report::all();

        foreach ($reports as $report) {
            // Cada reporte tiene entre 2 y 5 votos aleatorios
            $randomUsers = $users->random(rand(2, 5));
            
            foreach ($randomUsers as $user) {
                ReportVote::create([
                    'user_id' => $user->id,
                    'report_id' => $report->id,
                    'value' => rand(0, 10) > 2 ? 1 : -1, // Más believe que liar
                ]);
            }
        }
    }
}
