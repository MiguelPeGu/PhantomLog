<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReportSeeder extends Seeder
{
    public function run(): void
    {
        $userIds  = DB::table('users')->pluck('id')->toArray();
        $forumIds = DB::table('forums')->pluck('id')->toArray();

        $reports = [
            [
                'id'          => Str::uuid(),
                'forum_id'    => $forumIds[0],
                'user_id'     => $userIds[0],
                'title'       => 'Sombra extraña en el castillo de Belmonte',
                'description' => 'Durante mi visita nocturna al castillo de Belmonte capturé con mi cámara térmica una silueta humanoide que desapareció al intentar acercarme. Adjunto vídeo y lecturas del EMF.',
                'score'       => 34,
                'created_at'  => now()->subDays(10),
                'updated_at'  => now()->subDays(10),
            ],
            [
                'id'          => Str::uuid(),
                'forum_id'    => $forumIds[1],
                'user_id'     => $userIds[1],
                'title'       => 'Actividad en el Monasterio de Piedra',
                'description' => 'El pasado viernes realizamos una sesión de EVP en el ala norte del monasterio. Obtuvimos respuestas claras a preguntas directas. Compartimos el audio sin editar.',
                'score'       => 21,
                'created_at'  => now()->subDays(7),
                'updated_at'  => now()->subDays(7),
            ],
            [
                'id'          => Str::uuid(),
                'forum_id'    => $forumIds[2],
                'user_id'     => $userIds[2],
                'title'       => 'Comparativa de detectores EMF en campo',
                'description' => 'Análisis exhaustivo de tres modelos de detectores de campos electromagnéticos usados en seis localizaciones diferentes. Resultados, pros y contras de cada dispositivo.',
                'score'       => 57,
                'created_at'  => now()->subDays(5),
                'updated_at'  => now()->subDays(5),
            ],
            [
                'id'          => Str::uuid(),
                'forum_id'    => $forumIds[3],
                'user_id'     => $userIds[3],
                'title'       => 'Figura captada en cementerio de Segovia',
                'description' => 'Fotografía tomada a las 3am en el cementerio municipal de Segovia. La figura no estaba visible al ojo desnudo. Solicito análisis de la comunidad antes de publicar.',
                'score'       => 45,
                'created_at'  => now()->subDays(3),
                'updated_at'  => now()->subDays(3),
            ],
            [
                'id'          => Str::uuid(),
                'forum_id'    => $forumIds[4],
                'user_id'     => $userIds[4],
                'title'       => 'Expedición a la Casa Roja de Cuenca',
                'description' => 'Reporte completo de la expedición del pasado mes. Participaron 8 investigadores. Documentamos descensos de temperatura, voces y movimientos inexplicables en la planta baja.',
                'score'       => 72,
                'created_at'  => now()->subDays(1),
                'updated_at'  => now()->subDays(1),
            ],
        ];

        DB::table('reports')->insert($reports);
    }
}