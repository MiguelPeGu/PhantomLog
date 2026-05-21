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
            ['title' => 'Anomalía Térmica en Pasillo 4', 'desc' => 'Caída repentina de 15°C captada por cámara FLIR. Silueta antropomórfica detectada.', 'img' => 'anomalia_termica.jpg'],
            ['title' => 'Psicofonía Tipo A - Estéreo', 'desc' => 'Voz masculina susurrando "No debéis estar aquí". Grabada a 44kHz.', 'img' => 'psicofonia.jpg'],
            ['title' => 'Interferencia EMF Pico', 'desc' => 'El sensor K-II saltó a zona roja de forma sostenida cerca del altar.', 'img' => 'Senal-afectada-por-efectos-EMI.jpg'],
            ['title' => 'Movimiento de Objeto', 'desc' => 'Silla de madera desplazada 2 metros lateralmente sin causa física aparente.', 'img' => 'objeto_movido.jpg'],
            ['title' => 'Rastro de Ectoplasma UV', 'desc' => 'Fluido viscoso con luminiscencia bajo UV detectado en el pomo de la celda 12.', 'img' => 'ectoplasma-pesadilla.jpg'],
            ['title' => 'Fluctuación de Presión', 'desc' => 'Sensor barométrico registra caída brusca coincidiendo con un portazo.', 'img' => 'presion.jpg'],
            ['title' => 'Sombra Detectada por SLS', 'desc' => 'La cámara Kinect mapea una figura de 2 metros en una habitación vacía.', 'img' => 'sombra.jpg'],
            ['title' => 'Baterías Drenadas Súbitamente', 'desc' => 'Tres equipos pasaron del 100% al 0% en menos de 10 segundos.', 'img' => 'Bateria.jpg'],
            ['title' => 'Grabación de Pasos', 'desc' => 'Micrófono parabólico registra pasos pesados en el piso superior deshabitado.', 'img' => 'sal_pasos.jpg'],
            ['title' => 'Espejo Empañado', 'desc' => 'Aparición de una palabra escrita en el vaho del espejo del baño.', 'img' => 'espejo.jpg'],
            ['title' => 'Orbes en Gran Cantidad', 'desc' => 'Cámara de espectro completo capta decenas de esferas luminosas en movimiento.', 'img' => 'orbes.jpg'],
            ['title' => 'Grito Incorpóreo', 'desc' => 'Captura de audio de un grito femenino a pesar de estar solos en el edificio.', 'img' => 'grito.jpg'],
            ['title' => 'Cerradura Forzada', 'desc' => 'La puerta principal se bloqueó desde dentro sin que hubiera nadie.', 'img' => 'Cerradura_Forzada.jpg'],
            ['title' => 'Olor a Azufre Residual', 'desc' => 'Fuerte olor químico detectado tras una sesión de Spirit Box.', 'img' => 'azufre.jpg'],
            ['title' => 'Interferencia en Radio', 'desc' => 'El walkie-talkie emitió una melodía de caja de música antigua.', 'img' => 'radio.jpg'],
            ['title' => 'Sombra en la Ventana', 'desc' => 'Fotografía de una cara observando desde una ventana tapiada.', 'img' => 'sombra_ventana.jpg'],
            ['title' => 'Cambio en el Campo Magnético', 'desc' => 'La brújula empezó a girar sin control cerca de la chimenea.', 'img' => 'magnetico.jpg'],
            ['title' => 'Muestra de Cabello Extraña', 'desc' => 'Encontrada en un lugar donde no debería haber presencia humana.', 'img' => 'cabello.jpg'],
            ['title' => 'Luces Fatuas en el Jardín', 'desc' => 'Pequeñas luces azuladas flotando a ras de suelo.', 'img' => 'fatuo.jpg'],
            ['title' => 'Sensación de Toque Físico', 'desc' => 'Investigador reporta empujón en la espalda; cámara capta distorsión.', 'img' => 'alucinacion_tactil.jpg'],
        ];

        /** @var array{title: string, desc: string, img: string} $finding */
        $finding = $this->faker->randomElement($findings);

        $extraDetails = [
            'Se recomienda precaución extrema.',
            'El equipo de grabación registró picos inusuales.',
            'No se encontró explicación física para este fenómeno.',
            'La zona ha sido sellada para futuras investigaciones.',
            'Los testigos reportan una sensación de opresión constante.',
            'Se ha procedido a la purga energética del área.',
            'Protocolo de contención nivel 3 activado.',
            'Las lecturas EMF confirman la persistencia de la entidad.',
            'Se observó una distorsión visual en el espectro completo.'
        ];

        return [
            'id' => (string) Str::uuid(),
            'forum_id' => Forum::query()->inRandomOrder()->value('id') ?? Forum::factory(),
            'user_id' => function (array $attributes) {
                return Forum::find($attributes['forum_id'])?->user_id ?? (User::query()->inRandomOrder()->value('id') ?? User::factory());
            },
            'title' => $finding['title'].' [Ref: '.$this->faker->bothify('??-####').']',
            'description' => $finding['desc'].' '.$this->faker->randomElement($extraDetails),
            'image' => 'images/reports/'.$finding['img'],
            'score' => $this->faker->numberBetween(0, 50),
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
