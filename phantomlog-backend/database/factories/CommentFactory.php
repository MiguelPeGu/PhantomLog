<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Forum;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Comment>
 */
final class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'forum_id' => Forum::factory(),
            'user_id' => User::factory(),
            'report_id' => Report::factory(),
            'content' => $this->faker->randomElement([
                'He visto lo mismo en el sanatorio el mes pasado.',
                '¿Tenéis lecturas de temperatura de ese momento?',
                'Ese orbe parece una partícula de polvo, pero la trayectoria es extraña.',
                'Increíble captura, la Dama Blanca nunca decepciona.',
                'Tened cuidado, esa zona es conocida por drenar baterías.',
                'He analizado el audio y hay una voz de fondo claramente.',
                '¿Alguien más escuchó el portazo en el minuto 3?',
                'Esa silueta no parece humana, mirad la altura.',
                'Mis respetos al equipo por entrar ahí de noche.',
                'Seguid así, estas evidencias son oro para el archivo.'
            ]),
            'score' => $this->faker->numberBetween(0, 10),
        ];
    }
}
