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
            ['name' => 'Operación RíoOscuro', 'desc' => 'Expedición nocturna a las orillas del río Tajo en busca de La Llorona. Equipo de 4 investigadores con cámaras térmicas.'],
            ['name' => 'Ruta del Jinete', 'desc' => 'Seguimiento del camino rural donde se han registrado avistamientos del Jinete sin Cabeza durante los últimos tres años.'],
            ['name' => 'Carretera N-501', 'desc' => 'Patrulla nocturna de la N-501 donde se han reportado múltiples avistamientos de la Dama Blanca.'],
            ['name' => 'Claustro de Sombras', 'desc' => 'Investigación en el monasterio abandonado de San Pedro. Se documentarán las celdas del Monje Negro.'],
            ['name' => 'El Pozo Olvidado', 'desc' => 'Expedición al cortijo abandonado donde se localiza el pozo vinculado a la entidad infantil.'],
            ['name' => 'Operación: Silencio Eterno', 'desc' => 'Incursión nocturna para documentar la actividad en el ala abandonada del psiquiátrico.'],
            ['name' => 'Proyecto: Eco de Sombras', 'desc' => 'Despliegue de sensores EMF de alta precisión en el perímetro del cementerio antiguo.'],
            ['name' => 'Misión: Velo Levantado', 'desc' => 'Investigación conjunta para verificar la autenticidad de las apariciones en la mansión histórica.'],
            ['name' => 'Incursión: Rastro Cero', 'desc' => 'Búsqueda activa de anomalías espaciotemporales en el bosque de pinos tras los avistamientos.'],
            ['name' => 'Protocolo: Exorcismo Digital', 'desc' => 'Monitorización remota de flujos de datos anómalos en el centro de computación.'],
            ['name' => 'Sombra en el Torreón', 'desc' => 'Escalada técnica al torreón norte del castillo para instalar cámaras de movimiento.'],
            ['name' => 'Frecuencias del Más Allá', 'desc' => 'Estudio de radiofrecuencias en la antigua estación de tren abandonada.'],
            ['name' => 'El sótano de las muñecas', 'desc' => 'Exploración del sótano de la juguetería cerrada desde 1950. Nivel de riesgo: Extremo.'],
            ['name' => 'Neblina en el pantano', 'desc' => 'Búsqueda de luces fatuas en las marismas durante la luna llena.'],
            ['name' => 'Código Rojo: El Túnel', 'desc' => 'Investigación del túnel ferroviario tapiado tras el accidente de 1974.'],
            ['name' => 'La Guardiana del Faro', 'desc' => 'Vigilia nocturna en la linterna del faro para grabar la aparición de la guardiana.'],
            ['name' => 'Susurros en el Maizal', 'desc' => 'Detección de patrones en los campos de cultivo mediante drones térmicos.'],
            ['name' => 'Proyecto: Laberinto', 'desc' => 'Mapeado 3D de las catacumbas bajo la catedral vieja.'],
            ['name' => 'Operación: Espejo Negro', 'desc' => 'Experimento de percepción visual en la sala de espejos del palacio abandonado.'],
            ['name' => 'El Guardián del Puente', 'desc' => 'Investigación sobre el puente de piedra donde los animales se niegan a cruzar.'],
        ];

        /** @var array{name: string, desc: string} $mission */
        $mission = $this->faker->unique()->randomElement($missions);

        return [
            'id' => (string) Str::uuid(),
            'user_id' => User::query()->inRandomOrder()->value('id') ?? User::factory(),
            'phantom_id' => Phantom::query()->inRandomOrder()->value('id') ?? Phantom::factory(),
            'name' => $mission['name'],
            'description' => $mission['desc'],
            'location' => $this->faker->randomElement(['Málaga Este', 'Centro Histórico', 'Polígono Guadalhorce', 'Sierra de Mijas']),
            'date' => $this->faker->dateTimeBetween('-1 month', '+2 months'),
        ];
    }
}
