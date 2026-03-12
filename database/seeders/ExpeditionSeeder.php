<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Phantom;
use App\Models\Expedition;

class ExpeditionSeeder extends Seeder
{
    public function run(): void
    {
        $userIds    = User::pluck('id')->toArray();
        $phantomIds = Phantom::pluck('id')->toArray();

        $expeditions = [
            [
                'id'          => Str::uuid(),
                'user_id'     => $userIds[0],
                'phantom_id'  => $phantomIds[0],
                'name'        => 'Operación Río Oscuro',
                'description' => 'Expedición nocturna a las orillas del río Tajo en busca de la presencia conocida como La Llorona. Equipo de 4 investigadores con cámaras térmicas y grabadoras EVP.',
                'location'    => 'Río Tajo, Toledo',
                'date'        => now()->addDays(15),
            ],
            [
                'id'          => Str::uuid(),
                'user_id'     => $userIds[1],
                'phantom_id'  => $phantomIds[1],
                'name'        => 'Ruta del Jinete',
                'description' => 'Seguimiento del camino rural donde se han registrado avistamientos del Jinete sin Cabeza durante los últimos tres años. Incluye puntos GPS de los avistamientos previos.',
                'location'    => 'Camino de la Dehesa, Salamanca',
                'date'        => now()->addDays(22),
            ],
            [
                'id'          => Str::uuid(),
                'user_id'     => $userIds[2],
                'phantom_id'  => $phantomIds[2],
                'name'        => 'Carretera Fantasma N-501',
                'description' => 'Patrulla nocturna de la carretera N-501 donde se han reportado múltiples avistamientos de la Dama Blanca. Se establecerán puntos de observación cada 5 kilómetros.',
                'location'    => 'Carretera N-501, Toledo-Ávila',
                'date'        => now()->addDays(8),
            ],
            [
                'id'          => Str::uuid(),
                'user_id'     => $userIds[3],
                'phantom_id'  => $phantomIds[3],
                'name'        => 'Claustro de Sombras',
                'description' => 'Investigación en el interior del monasterio abandonado de San Pedro. Se documentarán las celdas del ala norte donde se han reportado apariciones del Monje Negro.',
                'location'    => 'Monasterio de San Pedro, Burgos',
                'date'        => now()->addDays(30),
            ],
            [
                'id'          => Str::uuid(),
                'user_id'     => $userIds[4],
                'phantom_id'  => $phantomIds[4],
                'name'        => 'El Pozo Olvidado',
                'description' => 'Expedición al cortijo abandonado donde se localiza el pozo vinculado a la entidad infantil. Se realizarán sesiones de comunicación y mediciones de temperatura.',
                'location'    => 'Cortijo Las Perdices, Córdoba',
                'date'        => now()->addDays(45),
            ],
        ];

        foreach ($expeditions as $expedition) {
            Expedition::create($expedition);
        }
    }
}