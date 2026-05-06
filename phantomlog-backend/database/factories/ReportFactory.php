<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Forum;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Report>
 */
final class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $findings = [
            ['title' => 'Anomalía Térmica en Pasillo 4', 'desc' => 'Caída repentina de 15°C captada por cámara FLIR. Se observa una silueta antropomórfica de 1.80m.', 'img' => 'belmonte_shadow.jpg'],
            ['title' => 'Psicofonía Tipo A - Captura Estéreo', 'desc' => 'Voz masculina susurrando "No debéis estar aquí". Grabada a 44kHz sin ruido de fondo aparente.', 'img' => 'cuenca_house.jpg'],
            ['title' => 'Interferencia Electromagnética Pico', 'desc' => 'El sensor K-II saltó a zona roja de forma sostenida durante 45 segundos cerca del altar.', 'img' => 'emf_comparison.jpg'],
            ['title' => 'Movimiento de Objeto no Inducido', 'desc' => 'Silla de madera desplazada 2 metros lateralmente. No hay corrientes de aire ni vibraciones sísmicas.', 'img' => 'monasterio_piedra.jpg'],
            ['title' => 'Rastro de Ectoplasma Residual', 'desc' => 'Fluido viscoso con luminiscencia bajo UV detectado en el pomo de la puerta de la celda 12.', 'img' => 'segovia_cemetery.jpg'],
        ];

        /** @var array{title: string, desc: string, img: string} $finding */
        $finding = $this->faker->randomElement($findings);

        return [
            'id' => (string) Str::uuid(),
            'forum_id' => Forum::query()->inRandomOrder()->value('id') ?? Forum::factory(),
            'user_id' => User::query()->inRandomOrder()->value('id') ?? User::factory(),
            'title' => $finding['title'],
            'description' => $finding['desc'],
            'image' => 'images/reports/'.$finding['img'],
            'score' => $this->faker->numberBetween(0, 50),
        ];
    }
}
