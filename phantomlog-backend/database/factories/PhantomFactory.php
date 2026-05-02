<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Phantom;

class PhantomFactory extends Factory
{
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

        $phantom = $this->faker->randomElement($phantoms);
        $index = array_search($phantom, $phantoms) + 1;

        return [
            'id' => (string) Str::uuid(),
            'name' => $phantom['name'],
            'type' => $phantom['type'],
            'description' => $phantom['desc'],
            'location' => $phantom['loc'],
            'image' => "images/phantoms/phantom_{$index}.jpg",
        ];
    }
}