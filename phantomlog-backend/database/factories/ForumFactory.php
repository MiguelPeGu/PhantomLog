<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Forum;
use App\Models\User;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Forum>
 */
class ForumFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cases = [
            ['title' => 'EXP-042: El Sanatorio de Sierra Espuña', 'desc' => 'Recopilación de psicofonías y evidencias visuales en el ala de tuberculosos. Nivel de riesgo: Alto.'],
            ['title' => 'DOC-109: La Casa de las Siete Chimeneas', 'desc' => 'Investigación sobre la aparición recurrente en los tejados de Madrid. Análisis de la leyenda vs realidad.'],
            ['title' => 'ARCHIVO: El Cortijo Jurado', 'desc' => 'Estudio de los túneles subterráneos y las luces observadas en los ventanales durante el solsticio.'],
            ['title' => 'CASO: El Palacio de Linares', 'desc' => 'Análisis de las grabaciones de Raimunda. Filtrado de audio profesional para detectar fraude.'],
            ['title' => 'REGISTRO: La Isla de las Muñecas', 'desc' => 'Expedición fotográfica para documentar el movimiento autónomo de los objetos en el canal.'],
        ];

        $case = $this->faker->randomElement($cases);
        $index = array_search($case, $cases) + 1;

        return [
            'id' => (string) Str::uuid(),
            'title' => $case['title'],
            'description' => $case['desc'],
            'image' => "images/forums/forum_{$index}.jpg",
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
        ];
    }
}
