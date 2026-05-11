<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Phantom;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Override;

/**
 * @extends Factory<Phantom>
 */
final class PhantomFactory extends Factory
{
    #[Override]
    protected $model = Phantom::class;

    public function definition(): array
    {
        $phantoms = [
            ['name' => 'Sombra de Pasillo', 'type' => 'Aparición', 'loc' => 'Edificio Antiguo', 'desc' => 'Entidad de clase IV. Se manifiesta como una silueta oscura bidimensional. Altamente esquiva.'],
            ['name' => 'Poltergeist Agresivo', 'type' => 'Poltergeist', 'loc' => 'Sótano Industrial', 'desc' => 'Manifestación física de energía cinética. Capaz de desplazar objetos pesados y causar daños estructurales.'],
            ['name' => 'Banshee de los Pantanos', 'type' => 'Espectro', 'loc' => 'Zona Húmeda', 'desc' => 'Entidad sonora. Su lamento puede causar desorientación y pánico extremo en los investigadores.'],
            ['name' => 'Espíritu Residual', 'type' => 'Aparición', 'loc' => 'Museo Local', 'desc' => 'Bucle energético que repite una acción pasada. No posee consciencia ni interactúa con el entorno.'],
            ['name' => 'Dama Blanca', 'type' => 'Aparición', 'loc' => 'Carretera Nacional', 'desc' => 'Aparición clásica vinculada a traumas emocionales. Suele manifestarse en carreteras y edificios históricos.'],
            ['name' => 'Niño de las Sombras', 'type' => 'Poltergeist', 'loc' => 'Escuela Abandonada', 'desc' => 'Entidad pequeña y rápida. Suele jugar con el equipo de los investigadores y emitir risas infantiles.'],
            ['name' => 'El Vigilante', 'type' => 'Sombra', 'loc' => 'Ático Antiguo', 'desc' => 'Entidad estática que observa desde las esquinas. No interactúa, pero drena las baterías del equipo.'],
            ['name' => 'Eco de Guerra', 'type' => 'Espectro', 'loc' => 'Campo de Batalla', 'desc' => 'Manifestación colectiva en campos de batalla. Se escuchan sonidos de combate y órdenes militares.'],
            ['name' => 'Aparición Vaporosa', 'type' => 'Aparición', 'loc' => 'Hospital Viejo', 'desc' => 'Masa de niebla blanquecina con forma vagamente humana. Deja rastros de humedad y frío.'],
            ['name' => 'El Cobrador', 'type' => 'Poltergeist', 'loc' => 'Casa Señorial', 'desc' => 'Entidad vinculada a objetos antiguos. Persigue a quien posee el objeto al que está anclado.'],
            ['name' => 'Súcubo de Energía', 'type' => 'Sombra', 'loc' => 'Estudio de Grabación', 'desc' => 'Se alimenta del miedo de los investigadores. Aumenta su visibilidad conforme crece el pánico.'],
            ['name' => 'Entidad Mimética', 'type' => 'Espectro', 'loc' => 'Refugio de Montaña', 'desc' => 'Capaz de imitar voces de miembros del equipo para separar al grupo. Extremadamente peligrosa.'],
            ['name' => 'Ancianidad Gris', 'type' => 'Aparición', 'loc' => 'Biblioteca Pública', 'desc' => 'Aparición de una figura anciana que suele advertir sobre peligros inminentes en el lugar.'],
            ['name' => 'Poltergeist Eléctrico', 'type' => 'Poltergeist', 'loc' => 'Central Eléctrica', 'desc' => 'Especializado en fundir bombillas y provocar cortocircuitos en los equipos digitales.'],
            ['name' => 'El Errante', 'type' => 'Sombra', 'loc' => 'Estación de Tren', 'desc' => 'Fantasma sin anclaje fijo que se desplaza entre diferentes localizaciones.'],
        ];

        /** @var array{name: string, type: string, loc: string, desc: string} $phantom */
        $phantom = $this->faker->unique()->randomElement($phantoms);
        $images = ['spirit.jpg', 'spectre.jpg', 'phantom.jpg', 'poltergeist.jpg', 'banshee.jpg', 'jinn.jpg', 'mare.jpg', 'revenant.jpg', 'shade.jpg', 'demon.jpg', 'yurei.jpg', 'onryo.jpg'];
        /** @var string $image */
        $image = $this->faker->randomElement($images);

        return [
            'id' => (string) Str::uuid(),
            'name' => $phantom['name'].' '.$this->faker->unique()->numberBetween(1000, 99999),
            'type' => $phantom['type'],
            'description' => $phantom['desc'],
            'location' => $phantom['loc'],
            'image' => 'images/phantoms/'.$image,
        ];
    }
}
