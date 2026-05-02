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
                'location'    => 'Sótano del Asilo de Teba',
                'image'       => 'images/phantoms/spirit.jpg',
            ],
            [
                'name'        => 'Espectro',
                'type'        => 'Volador',
                'description' => 'Un espectro es uno de los fantasmas más peligrosos. Es el único que puede atravesar paredes y volar.',
                'strengths'   => 'Casi nunca toca el suelo, lo que significa que no deja huellas físicas.',
                'weaknesses'  => 'Tiene una reacción tóxica a la sal.',
                'evidence'    => 'CEM Nivel 5, Caja de Espíritu, Proyector D.O.T.S',
                'location'    => 'Ático de la Mansión Grafton',
                'image'       => 'images/phantoms/spectre.jpg',
            ],
            [
                'name'        => 'Ente',
                'type'        => 'Visual',
                'description' => 'Un Ente es un fantasma que puede poseer a los vivos. Se le conoce por drenar la cordura de aquellos que lo miran directamente.',
                'strengths'   => 'Mirar a un Ente reducirá tu cordura considerablemente más rápido.',
                'weaknesses'  => 'Tomar una foto del Ente lo hará desaparecer temporalmente (aunque seguirá allí).',
                'evidence'    => 'Caja de Espíritu, Huellas Dactilares, Proyector D.O.T.S',
                'location'    => 'Pasillo 4B - Hospital Civil',
                'image'       => 'images/phantoms/phantom.jpg',
            ],
            [
                'name'        => 'Poltergeist',
                'type'        => 'Ruidoso',
                'description' => 'Conocido por manipular objetos a su alrededor para infundir miedo.',
                'strengths'   => 'Puede lanzar múltiples objetos a la vez a gran velocidad.',
                'weaknesses'  => 'Es casi ineficaz en una habitación vacía.',
                'evidence'    => 'Caja de Espíritu, Huellas Dactilares, Escritura Fantasmática',
                'location'    => 'Cocina de la Granja Bleasdale',
                'image'       => 'images/phantoms/poltergeist.jpg',
            ],
            [
                'name'        => 'Banshee',
                'type'        => 'Cazador',
                'description' => 'Una Banshee es un cazador natural que acecha a su presa antes de atacar.',
                'strengths'   => 'Solo fijará su objetivo en una persona a la vez hasta matarla.',
                'weaknesses'  => 'El micrófono parabólico puede captar su grito distintivo.',
                'evidence'    => 'Huellas Dactilares, Orbes Espectrales, Proyector D.O.T.S',
                'location'    => 'Jardín Laberinto - Palacio de Linares',
                'image'       => 'images/phantoms/banshee.jpg',
            ],
            [
                'name'        => 'Jinn',
                'type'        => 'Territorial',
                'description' => 'Un Jinn es un fantasma territorial que atacará cuando se siente amenazado.',
                'strengths'   => 'Viajará a una velocidad mucho mayor si la víctima está lejos y el cuadro eléctrico está encendido.',
                'weaknesses'  => 'Apagar el cuadro eléctrico evitará que el Jinn use su habilidad de velocidad.',
                'evidence'    => 'CEM Nivel 5, Huellas Dactilares, Temperaturas Bajo Cero',
                'location'    => 'Garaje del Chalet Willow Street',
                'image'       => 'images/phantoms/jinn.jpg',
            ],
            [
                'name'        => 'Pesadilla',
                'type'        => 'Oscuro',
                'description' => 'La Pesadilla es la fuente de todas las pesadillas, lo que la hace más poderosa en la oscuridad.',
                'strengths'   => 'Tiene una mayor probabilidad de atacar en la oscuridad.',
                'weaknesses'  => 'Encender las luces reducirá su agresividad.',
                'evidence'    => 'Caja de Espíritu, Orbes Espectrales, Escritura Fantasmática',
                'location'    => 'Dormitorio Principal - Granja Sunny Meadows',
                'image'       => 'images/phantoms/mare.jpg',
            ],
            [
                'name'        => 'Revenant',
                'type'        => 'Violento',
                'description' => 'Un Revenant es un fantasma violentó que atacará indiscriminadamente. Se mueve muy lento mientras está oculto, pero terriblemente rápido al cazar.',
                'strengths'   => 'Se mueve significativamente más rápido cuando caza a una víctima.',
                'weaknesses'  => 'Escondiéndose de él, se moverá muy lentamente.',
                'evidence'    => 'Orbes Espectrales, Escritura Fantasmática, Temperaturas Bajo Cero',
                'location'    => 'Capilla del Monasterio Abandonado',
                'image'       => 'images/phantoms/revenant.jpg',
            ],
            [
                'name'        => 'Sombra',
                'type'        => 'Tímido',
                'description' => 'La Sombra es conocida por ser un fantasma tímido. Detendrá toda actividad si hay varias personas cerca.',
                'strengths'   => 'Es mucho más difícil de encontrar y detectar.',
                'weaknesses'  => 'No entrará en modo caza si hay varias personas en la misma habitación.',
                'evidence'    => 'CEM Nivel 5, Escritura Fantasmática, Temperaturas Bajo Cero',
                'location'    => 'Biblioteca de la Escuela Secundaria',
                'image'       => 'images/phantoms/shade.jpg',
            ],
            [
                'name'        => 'Demonio',
                'type'        => 'Agresivo',
                'description' => 'Un demonio es uno de los peores fantasmas que te puedes encontrar. Se sabe que atacan sin motivo.',
                'strengths'   => 'Atacan con mucha más frecuencia que otros fantasmas.',
                'weaknesses'  => 'Los crucifijos tienen un radio de efectividad mayor contra ellos (5 metros en lugar de 3).',
                'evidence'    => 'Huellas Dactilares, Escritura Fantasmática, Temperaturas Bajo Cero',
                'location'    => 'Celda 12 - Prisión Estatal',
                'image'       => 'images/phantoms/demon.jpg',
            ],
            [
                'name'        => 'Yurei',
                'type'        => 'Vengativo',
                'description' => 'Un Yurei es un fantasma que ha regresado al mundo físico con el único propósito de vengarse.',
                'strengths'   => 'Se sabe que los Yurei tienen un fuerte efecto en la cordura de las personas.',
                'weaknesses'  => 'Encender incienso en el lugar de muerte del Yurei hará que deje de deambular temporalmente.',
                'evidence'    => 'Orbes Espectrales, Proyector D.O.T.S, Temperaturas Bajo Cero',
                'location'    => 'Ala de Cuidados Intensivos - Hospital de Teba',
                'image'       => 'images/phantoms/yurei.jpg',
            ],
            [
                'name'        => 'Onryo',
                'type'        => 'Espíritu de Fuego',
                'description' => 'El Onryo es conocido como "el espíritu colérico". Roba las almas de los cuerpos de sus víctimas para vengarse.',
                'strengths'   => 'Apagar una llama puede hacer que un Onryo ataque.',
                'weaknesses'  => 'Cuando se siente amenazado, es menos probable que este fantasma cace si hay fuego cerca.',
                'evidence'    => 'Caja de Espíritu, Orbes Espectrales, Temperaturas Bajo Cero',
                'location'    => 'Chimenea de la Residencia Edgefield',
                'image'       => 'images/phantoms/onryo.jpg',
            ],
        ];

        foreach ($phantoms as $data) {
            Phantom::create($data);
        }
    }
}