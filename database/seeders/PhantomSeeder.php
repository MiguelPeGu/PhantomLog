<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PhantomSeeder extends Seeder
{
    public function run(): void
    {
        $phantoms = [
            [
                'id'          => Str::uuid(),
                'name'        => 'La Llorona',
                'type'        => 'Espectro',
                'description' => 'Espíritu de una mujer que llora eternamente buscando a sus hijos perdidos. Se aparece cerca de ríos y lagos en noches oscuras.',
                'location'    => 'Guadalajara, México',
                'image'       => 'https://example.com/images/phantoms/la-llorona.jpg',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => Str::uuid(),
                'name'        => 'El Jinete sin Cabeza',
                'type'        => 'Aparición',
                'description' => 'Figura fantasmal de un jinete que recorre caminos rurales a medianoche sin cabeza visible, portando una linterna.',
                'location'    => 'Salamanca, España',
                'image'       => 'https://example.com/images/phantoms/jinete-sin-cabeza.jpg',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => Str::uuid(),
                'name'        => 'La Dama Blanca',
                'type'        => 'Fantasma',
                'description' => 'Mujer vestida de blanco que aparece en carreteras solitarias. Se dice que es el espíritu de una novia fallecida el día de su boda.',
                'location'    => 'Toledo, España',
                'image'       => 'https://example.com/images/phantoms/dama-blanca.jpg',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => Str::uuid(),
                'name'        => 'El Monje Negro',
                'type'        => 'Entidad',
                'description' => 'Presencia oscura con forma de monje que habita en monasterios abandonados. Provoca sensaciones de terror y confusión.',
                'location'    => 'Burgos, España',
                'image'       => 'https://example.com/images/phantoms/monje-negro.jpg',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => Str::uuid(),
                'name'        => 'La Niña del Pozo',
                'type'        => 'Espectro',
                'description' => 'Espíritu infantil atrapado en un pozo abandonado. Sus lamentos se escuchan en las noches de luna llena.',
                'location'    => 'Córdoba, España',
                'image'       => 'https://example.com/images/phantoms/nina-del-pozo.jpg',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ];

        DB::table('phantoms')->insert($phantoms);
    }
}