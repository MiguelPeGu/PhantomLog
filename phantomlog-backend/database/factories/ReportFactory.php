<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Report;
use App\Models\Forum;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $findings = [
            ['title' => 'Anomalía Térmica en Pasillo 4', 'desc' => 'Caída repentina de 15°C captada por cámara FLIR. Se observa una silueta antropomórfica de 1.80m.'],
            ['title' => 'Psicofonía Tipo A - Captura Estéreo', 'desc' => 'Voz masculina susurrando "No debéis estar aquí". Grabada a 44kHz sin ruido de fondo aparente.'],
            ['title' => 'Interferencia Electromagnética Pico', 'desc' => 'El sensor K-II saltó a zona roja de forma sostenida durante 45 segundos cerca del altar.'],
            ['title' => 'Movimiento de Objeto no Inducido', 'desc' => 'Silla de madera desplazada 2 metros lateralmente. No hay corrientes de aire ni vibraciones sísmicas.'],
            ['title' => 'Rastro de Ectoplasma Residual', 'desc' => 'Fluido viscoso con luminiscencia bajo UV detectado en el pomo de la puerta de la celda 12.'],
        ];

        $finding = $this->faker->randomElement($findings);
        $index = array_search($finding, $findings) + 1;

        return [
            'id' => (string) Str::uuid(),
            'forum_id' => Forum::inRandomOrder()->first()?->id ?? Forum::factory(),
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'title' => $finding['title'],
            'description' => $finding['desc'],
            'image' => "images/reports/report_{$index}.jpg",
            'score' => $this->faker->numberBetween(-10, 50),
        ];
    }
}
