<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ForumSeeder extends Seeder
{
    public function run(): void
    {
        $userIds = DB::table('users')->pluck('id')->toArray();

        $forums = [
            [
                'id'          => Str::uuid(),
                'title'       => 'Avistamientos Nocturnos',
                'description' => 'Comparte tus experiencias y avistamientos de entidades paranormales durante la noche. Relatos verificados por la comunidad.',
                'user_id'     => $userIds[0],
                'followers'   => 142,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => Str::uuid(),
                'title'       => 'Lugares Encantados España',
                'description' => 'Foro dedicado a la exploración de edificios, castillos y lugares con actividad paranormal registrada en España.',
                'user_id'     => $userIds[1],
                'followers'   => 98,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => Str::uuid(),
                'title'       => 'Técnicas de Investigación',
                'description' => 'Debate sobre métodos, equipos y técnicas para investigar fenómenos paranormales de manera rigurosa y documentada.',
                'user_id'     => $userIds[2],
                'followers'   => 215,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => Str::uuid(),
                'title'       => 'Fotografías Paranormales',
                'description' => 'Comparte y analiza fotografías con posibles anomalías. Expertos en edición digital ayudan a validar la autenticidad.',
                'user_id'     => $userIds[3],
                'followers'   => 67,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => Str::uuid(),
                'title'       => 'Expediciones Grupales',
                'description' => 'Organiza y únete a expediciones paranormales grupales. Planificación, seguridad y experiencias compartidas.',
                'user_id'     => $userIds[4],
                'followers'   => 183,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ];

        DB::table('forums')->insert($forums);
    }
}