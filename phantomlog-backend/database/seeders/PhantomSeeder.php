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
                'name'        => 'Espíritu',
                'type'        => 'Común',
                'description' => 'Los espíritus son los fantasmas más comunes. Suelen ser pasivos, pero atacarán si se les provoca demasiado.',
                'strengths'   => 'Ninguna.',
                'weaknesses'  => 'El incienso es más efectivo contra ellos, deteniendo sus ataques por un periodo más largo (180 segundos en lugar de 90).',
                'evidence'    => 'CEM Nivel 5, Caja de Espíritu, Escritura Fantasmática',
                'image'       => null,
            ],
            [
                'name'        => 'Espectro',
                'type'        => 'Volador',
                'description' => 'Un espectro es uno de los fantasmas más peligrosos. Es el único que puede atravesar paredes y volar.',
                'strengths'   => 'Casi nunca toca el suelo, lo que significa que no deja huellas físicas.',
                'weaknesses'  => 'Tiene una reacción tóxica a la sal.',
                'evidence'    => 'CEM Nivel 5, Caja de Espíritu, Proyector D.O.T.S',
                'image'       => null,
            ],
            [
                'name'        => 'Ente',
                'type'        => 'Visual',
                'description' => 'Un Ente es un fantasma que puede poseer a los vivos. Se le conoce por drenar la cordura de aquellos que lo miran directamente.',
                'strengths'   => 'Mirar a un Ente reducirá tu cordura considerablemente más rápido.',
                'weaknesses'  => 'Tomar una foto del Ente lo hará desaparecer temporalmente (aunque seguirá allí).',
                'evidence'    => 'Caja de Espíritu, Huellas Dactilares, Proyector D.O.T.S',
                'image'       => null,
            ],
            [
                'name'        => 'Poltergeist',
                'type'        => 'Ruidoso',
                'description' => 'Conocido por manipular objetos a su alrededor para infundir miedo.',
                'strengths'   => 'Puede lanzar múltiples objetos a la vez a gran velocidad.',
                'weaknesses'  => 'Es casi ineficaz en una habitación vacía.',
                'evidence'    => 'Caja de Espíritu, Huellas Dactilares, Escritura Fantasmática',
                'image'       => null,
            ],
            [
                'name'        => 'Banshee',
                'type'        => 'Cazador',
                'description' => 'Una Banshee es un cazador natural que acecha a su presa antes de atacar.',
                'strengths'   => 'Solo fijará su objetivo en una persona a la vez hasta matarla.',
                'weaknesses'  => 'El micrófono parabólico puede captar su grito distintivo.',
                'evidence'    => 'Huellas Dactilares, Orbes Espectrales, Proyector D.O.T.S',
                'image'       => null,
            ],
            [
                'name'        => 'Jinn',
                'type'        => 'Territorial',
                'description' => 'Un Jinn es un fantasma territorial que atacará cuando se siente amenazado.',
                'strengths'   => 'Viajará a una velocidad mucho mayor si la víctima está lejos y el cuadro eléctrico está encendido.',
                'weaknesses'  => 'Apagar el cuadro eléctrico evitará que el Jinn use su habilidad de velocidad.',
                'evidence'    => 'CEM Nivel 5, Huellas Dactilares, Temperaturas Bajo Cero',
                'image'       => null,
            ],
            [
                'name'        => 'Pesadilla',
                'type'        => 'Oscuro',
                'description' => 'La Pesadilla es la fuente de todas las pesadillas, lo que la hace más poderosa en la oscuridad.',
                'strengths'   => 'Tiene una mayor probabilidad de atacar en la oscuridad.',
                'weaknesses'  => 'Encender las luces reducirá su agresividad.',
                'evidence'    => 'Caja de Espíritu, Orbes Espectrales, Escritura Fantasmática',
                'image'       => null,
            ],
            [
                'name'        => 'Revenant',
                'type'        => 'Violento',
                'description' => 'Un Revenant es un fantasma violento que atacará indiscriminadamente. Se mueve muy lento mientras está oculto, pero terriblemente rápido al cazar.',
                'strengths'   => 'Se mueve significativamente más rápido cuando caza a una víctima.',
                'weaknesses'  => 'Escondiéndose de él, se moverá muy lentamente.',
                'evidence'    => 'Orbes Espectrales, Escritura Fantasmática, Temperaturas Bajo Cero',
                'image'       => null,
            ],
            [
                'name'        => 'Sombra',
                'type'        => 'Tímido',
                'description' => 'La Sombra es conocida por ser un fantasma tímido. Detendrá toda actividad si hay varias personas cerca.',
                'strengths'   => 'Es mucho más difícil de encontrar y detectar.',
                'weaknesses'  => 'No entrará en modo caza si hay varias personas en la misma habitación.',
                'evidence'    => 'CEM Nivel 5, Escritura Fantasmática, Temperaturas Bajo Cero',
                'image'       => null,
            ],
            [
                'name'        => 'Demonio',
                'type'        => 'Agresivo',
                'description' => 'Un demonio es uno de los peores fantasmas que te puedes encontrar. Se sabe que atacan sin motivo.',
                'strengths'   => 'Atacan con mucha más frecuencia que otros fantasmas.',
                'weaknesses'  => 'Los crucifijos tienen un radio de efectividad mayor contra ellos (5 metros en lugar de 3).',
                'evidence'    => 'Huellas Dactilares, Escritura Fantasmática, Temperaturas Bajo Cero',
                'image'       => null,
            ],
        ];

        foreach ($phantoms as $data) {
            Phantom::create($data);
        }
    }
}