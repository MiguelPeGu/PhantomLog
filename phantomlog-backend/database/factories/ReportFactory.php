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
            ['title' => 'Anomalía Térmica en Pasillo 4', 'desc' => 'Caída repentina de 15°C captada por cámara FLIR. Silueta antropomórfica detectada.', 'img' => 'belmonte_shadow.jpg'],
            ['title' => 'Psicofonía Tipo A - Estéreo', 'desc' => 'Voz masculina susurrando "No debéis estar aquí". Grabada a 44kHz.', 'img' => 'cuenca_house.jpg'],
            ['title' => 'Interferencia EMF Pico', 'desc' => 'El sensor K-II saltó a zona roja de forma sostenida cerca del altar.', 'img' => 'emf_comparison.jpg'],
            ['title' => 'Movimiento de Objeto', 'desc' => 'Silla de madera desplazada 2 metros lateralmente sin causa física aparente.', 'img' => 'monasterio_piedra.jpg'],
            ['title' => 'Rastro de Ectoplasma UV', 'desc' => 'Fluido viscoso con luminiscencia bajo UV detectado en el pomo de la celda 12.', 'img' => 'segovia_cemetery.jpg'],
            ['title' => 'Fluctuación de Presión', 'desc' => 'Sensor barométrico registra caída brusca coincidiendo con un portazo.', 'img' => 'belmonte_shadow.jpg'],
            ['title' => 'Sombra Detectada por SLS', 'desc' => 'La cámara Kinect mapea una figura de 2 metros en una habitación vacía.', 'img' => 'cuenca_house.jpg'],
            ['title' => 'Baterías Drenadas Súbitamente', 'desc' => 'Tres equipos pasaron del 100% al 0% en menos de 10 segundos.', 'img' => 'emf_comparison.jpg'],
            ['title' => 'Grabación de Pasos', 'desc' => 'Micrófono parabólico registra pasos pesados en el piso superior deshabitado.', 'img' => 'monasterio_piedra.jpg'],
            ['title' => 'Espejo Empañado', 'desc' => 'Aparición de una palabra escrita en el vaho del espejo del baño.', 'img' => 'segovia_cemetery.jpg'],
            ['title' => 'Orbes en Gran Cantidad', 'desc' => 'Cámara de espectro completo capta decenas de esferas luminosas en movimiento.', 'img' => 'belmonte_shadow.jpg'],
            ['title' => 'Grito Incorpóreo', 'desc' => 'Captura de audio de un grito femenino a pesar de estar solos en el edificio.', 'img' => 'cuenca_house.jpg'],
            ['title' => 'Cerradura Forzada', 'desc' => 'La puerta principal se bloqueó desde dentro sin que hubiera nadie.', 'img' => 'emf_comparison.jpg'],
            ['title' => 'Olor a Azufre Residual', 'desc' => 'Fuerte olor químico detectado tras una sesión de Spirit Box.', 'img' => 'monasterio_piedra.jpg'],
            ['title' => 'Interferencia en Radio', 'desc' => 'El walkie-talkie emitió una melodía de caja de música antigua.', 'img' => 'segovia_cemetery.jpg'],
            ['title' => 'Sombra en la Ventana', 'desc' => 'Fotografía de una cara observando desde una ventana tapiada.', 'img' => 'belmonte_shadow.jpg'],
            ['title' => 'Cambio en el Campo Magnético', 'desc' => 'La brújula empezó a girar sin control cerca de la chimenea.', 'img' => 'cuenca_house.jpg'],
            ['title' => 'Muestra de Cabello Extraña', 'desc' => 'Encontrada en un lugar donde no debería haber presencia humana.', 'img' => 'emf_comparison.jpg'],
            ['title' => 'Luces Fatuas en el Jardín', 'desc' => 'Pequeñas luces azuladas flotando a ras de suelo.', 'img' => 'monasterio_piedra.jpg'],
            ['title' => 'Sensación de Toque Físico', 'desc' => 'Investigador reporta empujón en la espalda; cámara capta distorsión.', 'img' => 'segovia_cemetery.jpg'],
        ];

        // Elegimos un hallazgo base (sin unique para no agotar la lista)
        $finding = $this->faker->randomElement($findings);

        return [
            'id' => (string) Str::uuid(),
            'forum_id' => Forum::query()->inRandomOrder()->value('id') ?? Forum::factory(),
            'user_id' => User::query()->inRandomOrder()->value('id') ?? User::factory(),
            'title' => $finding['title'] . ' [Ref: ' . $this->faker->bothify('??-####') . ']',
            'description' => $finding['desc'] . ' ' . $this->faker->sentence(),
            'image' => 'images/reports/'.$finding['img'],
            'score' => $this->faker->numberBetween(0, 50),
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
