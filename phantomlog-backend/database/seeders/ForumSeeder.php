<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Forum;
use App\Models\User;
use Illuminate\Database\Seeder;

final class ForumSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        $forums = [
            [
                'title' => 'Avistamientos Nocturnos',
                'description' => 'Comparte tus experiencias y avistamientos de entidades paranormales durante la noche. Relatos verificados por la comunidad.',
                'image' => 'images/forums/night_sightings.jpg',
            ],
            [
                'title' => 'Lugares Encantados España',
                'description' => 'Foro dedicado a la exploración de edificios, castillos y lugares con actividad paranormal registrada en España.',
                'image' => 'images/forums/haunted_spain.jpg',
            ],
            [
                'title' => 'Técnicas de Investigación',
                'description' => 'Debate sobre métodos, equipos y técnicas para investigar fenómenos paranormales de manera rigurosa y documentada.',
                'image' => 'images/forums/investigation_tech.jpg',
            ],
            [
                'title' => 'Fotografías Paranormales',
                'description' => 'Comparte y analiza fotografías con posibles anomalías. Expertos en edición digital ayudan a validar la autenticidad.',
                'image' => 'images/forums/paranormal_photos.jpg',
            ],
            [
                'title' => 'Expediciones Grupales',
                'description' => 'Organiza y únete a expediciones paranormales grupales. Planificación, seguridad y experiencias compartidas.',
                'image' => 'images/forums/group_expeditions.jpg',
            ],
        ];

        if ($users->isEmpty()) {
            return;
        }

        foreach ($forums as $index => $data) {
            $user = $users[$index] ?? null;
            if ($user instanceof User) {
                $user->forums()->create($data);
            }
        }

        Forum::factory()->count(25)->create();
    }
}
