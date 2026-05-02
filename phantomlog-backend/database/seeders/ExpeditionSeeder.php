<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Phantom;
use App\Models\User;
use Illuminate\Database\Seeder;

final class ExpeditionSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $phantoms = Phantom::all();

        $expeditions = [
            [
                'phantom_id' => $phantoms[0]->id,
                'name' => 'Operación RíoOscuro',
                'description' => 'Expedición nocturna a las orillas del río Tajo en busca de La Llorona. Equipo de 4 investigadores con cámaras térmicas y grabadoras EVP.',
                'location' => 'Río Tajo, Toledo',
                'date' => now()->addDays(15),
            ],
            [
                'phantom_id' => $phantoms[1]->id,
                'name' => 'Ruta del Jinete',
                'description' => 'Seguimiento del camino rural donde se han registrado avistamientos del Jinete sin Cabeza durante los últimos tres años.',
                'location' => 'Camino de la Dehesa, Salamanca',
                'date' => now()->addDays(22),
            ],
            [
                'phantom_id' => $phantoms[2]->id,
                'name' => 'Carretera N-501',
                'description' => 'Patrulla nocturna de la N-501 donde se han reportado múltiples avistamientos de la Dama Blanca.',
                'location' => 'Carretera N-501, Toledo-Ávila',
                'date' => now()->addDays(8),
            ],
            [
                'phantom_id' => $phantoms[3]->id,
                'name' => 'Claustro de Sombras',
                'description' => 'Investigación en el monasterio abandonado de San Pedro. Se documentarán las celdas donde aparece el Monje Negro.',
                'location' => 'Monasterio de San Pedro, Burgos',
                'date' => now()->addDays(30),
            ],
            [
                'phantom_id' => $phantoms[4]->id,
                'name' => 'El Pozo Olvidado',
                'description' => 'Expedición al cortijo abandonado donde se localiza el pozo vinculado a la entidad infantil. Sesiones de comunicación y mediciones.',
                'location' => 'Cortijo Las Perdices, Córdoba',
                'date' => now()->addDays(45),
            ],
        ];

        foreach ($expeditions as $index => $data) {
            $users[$index]->createdExpeditions()->create($data);
        }

        \App\Models\Expedition::factory()->count(25)->create();
    }
}
