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
            ['name' => 'El Enmascarado de Larios', 'type' => 'Aparición', 'loc' => 'Calle Larios, Málaga', 'desc' => 'Figura alta con máscara veneciana que se desvanece al ser observada directamente.'],
            ['name' => 'La Niña del Hospital Civil', 'type' => 'Poltergeist', 'loc' => 'Hospital Civil, Málaga', 'desc' => 'Entidad infantil que arroja instrumental médico y produce llantos en el ala norte.'],
            ['name' => 'Sombras de la Alcazaba', 'type' => 'Sombra', 'loc' => 'Alcazaba, Málaga', 'desc' => 'Masas negras que reptan por las murallas durante las noches sin luna.'],
            ['name' => 'El Monje de San Telmo', 'type' => 'Espectro', 'loc' => 'Acueducto de San Telmo', 'desc' => 'Figura encapuchada que camina sobre el agua del acueducto emitiendo un salmo ininteligible.'],
            ['name' => 'Dama Blanca de la Concepción', 'type' => 'Aparición', 'loc' => 'Jardín Botánico La Concepción', 'desc' => 'Mujer con vestido de época que busca algo entre los ficus centenarios.'],
        ];

        /** @var array{name: string, type: string, loc: string, desc: string} $phantom */
        $phantom = $this->faker->randomElement($phantoms);
        $images = ['spirit.jpg', 'spectre.jpg', 'phantom.jpg', 'poltergeist.jpg', 'banshee.jpg', 'jinn.jpg', 'mare.jpg', 'revenant.jpg', 'shade.jpg', 'demon.jpg', 'yurei.jpg', 'onryo.jpg'];
        /** @var string $image */
        $image = $this->faker->randomElement($images);

        return [
            'id' => (string) Str::uuid(),
            'name' => $phantom['name'],
            'type' => $phantom['type'],
            'description' => $phantom['desc'],
            'location' => $phantom['loc'],
            'image' => 'images/phantoms/'.$image,
        ];
    }
}
