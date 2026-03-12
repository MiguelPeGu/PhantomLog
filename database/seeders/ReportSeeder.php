<?php

namespace Database\Seeders;

use App\Models\Forum;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReportSeeder extends Seeder
{
    public function run(): void
    {
        $users  = User::all();
        $forums = Forum::all();

        $reports = [
            [
                'forum_id'    => $forums[0]->id,
                'title'       => 'Sombra extraña en el castillo de Belmonte',
                'description' => 'Durante mi visita nocturna al castillo de Belmonte capturé con mi cámara térmica una silueta humanoide que desapareció al intentar acercarme. Adjunto vídeo y lecturas del EMF.',
                'score'       => 34,
            ],
            [
                'forum_id'    => $forums[1]->id,
                'title'       => 'Actividad en el Monasterio de Piedra',
                'description' => 'El pasado viernes realizamos una sesión de EVP en el ala norte del monasterio. Obtuvimos respuestas claras a preguntas directas. Compartimos el audio sin editar.',
                'score'       => 21,
            ],
            [
                'forum_id'    => $forums[2]->id,
                'title'       => 'Comparativa de detectores EMF en campo',
                'description' => 'Análisis exhaustivo de tres modelos de detectores EMF usados en seis localizaciones diferentes. Resultados, pros y contras de cada dispositivo.',
                'score'       => 57,
            ],
            [
                'forum_id'    => $forums[3]->id,
                'title'       => 'Figura captada en cementerio de Segovia',
                'description' => 'Fotografía tomada a las 3am en el cementerio municipal de Segovia. La figura no estaba visible al ojo desnudo. Solicito análisis de la comunidad.',
                'score'       => 45,
            ],
            [
                'forum_id'    => $forums[4]->id,
                'title'       => 'Expedición a la Casa Roja de Cuenca',
                'description' => 'Reporte completo de la expedición del pasado mes. Participaron 8 investigadores. Documentamos descensos de temperatura y voces inexplicables en la planta baja.',
                'score'       => 72,
            ],
        ];

        foreach ($reports as $index => $data) {
            $users[$index]->reports()->create($data);
        }
    }
}