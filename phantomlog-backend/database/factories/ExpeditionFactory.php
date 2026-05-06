<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Expedition;
use App\Models\Phantom;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Override;

/**
 * @extends Factory<Expedition>
 */
final class ExpeditionFactory extends Factory
{
    #[Override]
    protected $model = Expedition::class;

    public function definition(): array
    {
        $missions = [
            ['name' => 'Operación: Silencio Eterno', 'desc' => 'Incursión nocturna para documentar la actividad en el ala abandonada del psiquiátrico.'],
            ['name' => 'Proyecto: Eco de Sombras', 'desc' => 'Despliegue de sensores EMF de alta precisión en el perímetro del cementerio antiguo.'],
            ['name' => 'Misión: Velo Levantado', 'desc' => 'Investigación conjunta para verificar la autenticidad de las apariciones en la mansión histórica.'],
            ['name' => 'Incursión: Rastro Cero', 'desc' => 'Búsqueda activa de anomalías espaciotemporales en el bosque de pinos tras los avistamientos.'],
            ['name' => 'Protocolo: Exorcismo Digital', 'desc' => 'Monitorización remota de flujos de datos anómalos en el centro de computación.'],
        ];

        $mission = $this->faker->randomElement($missions);

        return [
            'id' => (string) Str::uuid(),
            'user_id' => User::query()->inRandomOrder()->first()?->id ?? User::factory(),
            'phantom_id' => Phantom::query()->inRandomOrder()->first()?->id ?? Phantom::factory(),
            'name' => $mission['name'],
            'description' => $mission['desc'],
            'location' => $this->faker->randomElement(['Málaga Este', 'Centro Histórico', 'Polígono Guadalhorce', 'Sierra de Mijas']),
            'date' => $this->faker->dateTimeBetween('-1 month', '+2 months'),
        ];
    }
}
