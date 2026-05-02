<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class ForumSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        $forums = [
            [
                'title'       => 'Avistamientos Nocturnos',
                'description' => 'Comparte tus experiencias y avistamientos de entidades paranormales durante la noche. Relatos verificados por la comunidad.',
                'image'       => 'https://api.dicebear.com/9.x/icons/svg?seed=Night',
            ],
            [
                'title'       => 'Lugares Encantados España',
                'description' => 'Foro dedicado a la exploración de edificios, castillos y lugares con actividad paranormal registrada en España.',
                'image'       => 'https://api.dicebear.com/9.x/icons/svg?seed=Castle',
            ],
            [
                'title'       => 'Técnicas de Investigación',
                'description' => 'Debate sobre métodos, equipos y técnicas para investigar fenómenos paranormales de manera rigurosa y documentada.',
                'image'       => 'https://api.dicebear.com/9.x/icons/svg?seed=Tech',
            ],
            [
                'title'       => 'Fotografías Paranormales',
                'description' => 'Comparte y analiza fotografías con posibles anomalías. Expertos en edición digital ayudan a validar la autenticidad.',
                'image'       => 'https://api.dicebear.com/9.x/icons/svg?seed=Photo',
            ],
            [
                'title'       => 'Expediciones Grupales',
                'description' => 'Organiza y únete a expediciones paranormales grupales. Planificación, seguridad y experiencias compartidas.',
                'image'       => 'https://api.dicebear.com/9.x/icons/svg?seed=Group',
            ],
        ];

        foreach ($forums as $index => $data) {
            $users[$index]->forums()->create($data);
        }

        \App\Models\Forum::factory()->count(25)->create();
    }
}