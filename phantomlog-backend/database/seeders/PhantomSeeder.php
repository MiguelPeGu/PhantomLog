<?php

namespace Database\Seeders;

use App\Models\Phantom;
use Illuminate\Database\Seeder;

class PhantomSeeder extends Seeder
{
    public function run(): void
    {
        $phantoms = [
            [
                'name'        => 'La Llorona',
                'type'        => 'Espectro',
                'description' => 'Espíritu de una mujer que llora eternamente buscando a sus hijos perdidos. Se aparece cerca de ríos y lagos en noches oscuras.',
                'location'    => 'Guadalajara, México',
                'image'       => 'https://api.dicebear.com/9.x/lorelei/svg?seed=Llorona',
            ],
            [
                'name'        => 'El Jinete sin Cabeza',
                'type'        => 'Aparición',
                'description' => 'Figura fantasmal de un jinete que recorre caminos rurales a medianoche sin cabeza visible, portando una linterna.',
                'location'    => 'Salamanca, España',
                'image'       => 'https://api.dicebear.com/9.x/lorelei/svg?seed=Jinete',
            ],
            [
                'name'        => 'La Dama Blanca',
                'type'        => 'Fantasma',
                'description' => 'Mujer vestida de blanco que aparece en carreteras solitarias. Se dice que es el espíritu de una novia fallecida el día de su boda.',
                'location'    => 'Toledo, España',
                'image'       => 'https://api.dicebear.com/9.x/lorelei/svg?seed=DamaBlanca',
            ],
            [
                'name'        => 'El Monje Negro',
                'type'        => 'Entidad',
                'description' => 'Presencia oscura con forma de monje que habita en monasterios abandonados. Provoca sensaciones de terror y confusión en quienes lo presencian.',
                'location'    => 'Burgos, España',
                'image'       => 'https://api.dicebear.com/9.x/lorelei/svg?seed=MonjeNegro',
            ],
            [
                'name'        => 'La Niña del Pozo',
                'type'        => 'Espectro',
                'description' => 'Espíritu infantil atrapado en un pozo abandonado. Sus lamentos se escuchan en las noches de luna llena.',
                'location'    => 'Córdoba, España',
                'image'       => 'https://api.dicebear.com/9.x/lorelei/svg?seed=NinaPozo',
            ],
        ];

        foreach ($phantoms as $data) {
            Phantom::create($data);
        }
    }
}