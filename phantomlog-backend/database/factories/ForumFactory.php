<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Forum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Forum>
 */
final class ForumFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cases = [
            ['title' => 'Avistamientos Nocturnos', 'desc' => 'Comparte tus experiencias y avistamientos de entidades paranormales durante la noche. Relatos verificados por la comunidad.', 'image' => 'images/forums/night_sightings.jpg'],
            ['title' => 'Lugares Encantados España', 'desc' => 'Foro dedicado a la exploración de edificios, castillos y lugares con actividad paranormal registrada en España.', 'image' => 'images/forums/haunted_spain.jpg'],
            ['title' => 'Técnicas de Investigación', 'desc' => 'Debate sobre métodos, equipos y técnicas para investigar fenómenos paranormales de manera rigurosa y documentada.', 'image' => 'images/forums/investigation_tech.jpg'],
            ['title' => 'Fotografías Paranormales', 'desc' => 'Comparte y analiza fotografías con posibles anomalías. Expertos en edición digital ayudan a validar la autenticidad.', 'image' => 'images/forums/paranormal_photos.jpg'],
            ['title' => 'Expediciones Grupales', 'desc' => 'Organiza y únete a expediciones paranormales grupales. Planificación, seguridad y experiencias compartidas.', 'image' => 'images/forums/group_expeditions.jpg'],
            ['title' => 'EXP-042: El Sanatorio de Sierra Espuña', 'desc' => 'Recopilación de psicofonías y evidencias visuales en el ala de tuberculosos. Nivel de riesgo: Alto.', 'image' => 'images/forums/sanatorio-sierra.jpg'],
            ['title' => 'DOC-109: La Casa de las Siete Chimeneas', 'desc' => 'Investigación sobre la aparición recurrente en los tejados de Madrid. Análisis de la leyenda vs realidad.', 'image' => 'images/forums/Casa_de_las_7_Chimeneas.jpg'],
            ['title' => 'ARCHIVO: El Cortijo Jurado', 'desc' => 'Estudio de los túneles subterráneos y las luces observadas en los ventanales durante el solsticio.', 'image' => 'images/forums/cortijo_jurado.jpg'],
            ['title' => 'CASO: El Palacio de Linares', 'desc' => 'Análisis de las grabaciones de Raimunda. Filtrado de audio profesional para detectar fraude.', 'image' => 'images/forums/palacio_linares.jpg'],
            ['title' => 'REGISTRO: La Isla de las Muñecas', 'desc' => 'Expedición fotográfica para documentar el movimiento autónomo de los objetos en el canal.', 'image' => 'images/forums/isla-de-las-munecas.jpg'],
            ['title' => 'INF-666: El Preventorio de Aigües', 'desc' => 'Detección de fluctuaciones electromagnéticas en las antiguas piscinas termales. Fenómeno recurrente.', 'image' => 'images/forums/preventorio.jpg'],
            ['title' => 'EXP-771: Belchite: Voces del pasado', 'desc' => 'Sesiones de transcomunicación instrumental en las ruinas de la iglesia de San Martín.', 'image' => 'images/forums/belchite.jpg'],
            ['title' => 'DOC-012: Hospital del Tórax de Terrassa', 'desc' => 'Investigación en la novena planta. Registro de sombras antropomórficas y cambios bruscos de temperatura.', 'image' => 'images/forums/Hospital_del_Tórax_de_Terrassa.jpg'],
            ['title' => 'ARCHIVO: El Pueblo de Ochate', 'desc' => 'Seguimiento de luces no identificadas y desapariciones temporales en el condado de Treviño.', 'image' => 'images/forums/Ochate-torre-y-casa.jpg'],
            ['title' => 'CASO: El Edificio de Prisiones de Málaga', 'desc' => 'Fenómenos de poltergeist documentados por el personal de seguridad. Análisis de cámaras térmicas.', 'image' => 'images/forums/prisiones-malaga.jpg'],
            ['title' => 'REGISTRO: El Pazo de Meirás', 'desc' => 'Actividad residual detectada en la biblioteca y torres principales durante la noche.', 'image' => 'images/forums/palacio_meiras.jpg'],
            ['title' => 'INF-999: El Monasterio del Diablo', 'desc' => 'Rituales documentados y restos de actividad oculta en las ruinas del monasterio cisterciense.', 'image' => 'images/forums/monasterio_diablo.jpg'],
            ['title' => 'EXP-102: Cuevas de Zugarramurdi', 'desc' => 'Búsqueda de huellas acústicas de antiguos rituales. Análisis de frecuencias infrasónicas.', 'image' => 'images/forums/cuevas.jpg'],
            ['title' => 'DOC-555: El Hotel Corona de Aragón', 'desc' => 'Investigación sobre la "Habitación 510" y los testimonios de huéspedes actuales sobre presencias.', 'image' => 'images/forums/zaragoza-hotel.jpg'],
            ['title' => 'ARCHIVO: El Teatro Tapia', 'desc' => 'Registros de una entidad femenina en los palcos superiores. Grabación de ecos de ópera.', 'image' => 'images/forums/teatrotapia.jpg'],
            ['title' => 'CASO: La Mansión Winchester', 'desc' => 'Estudio arquitectónico y psicométrico de las escaleras que no llevan a ninguna parte.', 'image' => 'images/forums/mansion_winchester.jpg'],
            ['title' => 'REGISTRO: Eastern State Penitentiary', 'desc' => 'Caza de orbes y sombras en el bloque de celdas 12. Documentación de voces incorpóreas.', 'image' => 'images/forums/the-facade-of-eastern.jpg'],
            ['title' => 'INF-111: Asilo de Waverly Hills', 'desc' => 'Investigación en el túnel de la muerte. Uso de equipos SLS para detectar figuras humanas.', 'image' => 'images/forums/waverly.jpg'],
            ['title' => 'EXP-404: El Bosque de Aokigahara', 'desc' => 'Expedición técnica para medir anomalías magnéticas que afectan a las brújulas en el denso bosque.', 'image' => 'images/forums/aokigahara.jpg'],
            ['title' => 'DOC-911: La Torre de Londres', 'desc' => 'Monitoreo de la "Dama Blanca" en la White Tower mediante sensores de movimiento láser.', 'image' => 'images/forums/torre-de-londres.jpg'],
            ['title' => 'ARCHIVO: El Castillo de Edimburgo', 'desc' => 'Investigación sobre el "Flautista sin cabeza" en las bóvedas subterráneas del castillo.', 'image' => 'images/forums/edimburgo.jpg'],
            ['title' => 'CASO: Poveglia: La Isla del Pánico', 'desc' => 'Desembarco nocturno en la isla prohibida de Venecia. Registro de actividad extrema.', 'image' => 'images/forums/isla-panico.jpg'],
            ['title' => 'REGISTRO: El Queen Mary (B340)', 'desc' => 'Estancia nocturna en el camarote más encantado del transatlántico. Equipos de grabación 24h.', 'image' => 'images/forums/queen-mary.jpg'],
            ['title' => 'INF-001: Catacumbas de París', 'desc' => 'Exploración de túneles no cartografiados. Registro de ruidos de pasos tras las paredes de huesos.', 'image' => 'images/forums/catacumbas.jpg'],
            ['title' => 'EXP-992: El Orfanato de San Cristóbal', 'desc' => 'Documentación de risas infantiles y movimiento de juguetes en el antiguo dormitorio común.', 'image' => 'images/forums/orfanato.jpg'],
            ['title' => 'DOC-222: El Cementerio de Highgate', 'desc' => 'Búsqueda de la entidad conocida como "El Vampiro de Highgate". Análisis forense de tumbas.', 'image' => 'images/forums/highgate.jpg'],
            ['title' => 'ARCHIVO: La Quinta del Sordo', 'desc' => 'Búsqueda de improntas energéticas de las "Pinturas Negras" en el solar original de Goya.', 'image' => 'images/forums/quinta-del-sordo.jpg'],
            ['title' => 'CASO: Estación de Chamberí (Metro)', 'desc' => 'Investigación tras el cierre del servicio. Avistamientos de pasajeros con vestimentas de 1919.', 'image' => 'images/forums/quita-chamberi.jpg'],
            ['title' => 'REGISTRO: El Faro de St. Augustine', 'desc' => 'Seguimiento de las sombras de las niñas que merodean la torre del faro. Análisis de audio.', 'image' => 'images/forums/faro.jpg'],
            ['title' => 'INF-777: Psiquiátrico de Gonjiam', 'desc' => 'Expedición al hospital más aterrador de Corea. Registro de portazos y sombras en los pasillos.', 'image' => 'images/forums/gonjiam.jpg'],
        ];

        /** @var array{title: string, desc: string, image: string} $case */
        $case = $this->faker->unique()->randomElement($cases);

        return [
            'id' => (string) Str::uuid(),
            'title' => $case['title'],
            'description' => $case['desc'],
            'image' => $case['image'],
            'user_id' => User::query()->inRandomOrder()->value('id') ?? User::factory(),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => fn (array $attributes) => $attributes['created_at'],
        ];
    }
}
