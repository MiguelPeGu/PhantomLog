<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $userIds   = DB::table('users')->pluck('id')->toArray();
        $reportIds = DB::table('reports')->pluck('id')->toArray();

        $comments = [
            // Comentarios del report 0
            [
                'id'         => Str::uuid(),
                'report_id'  => $reportIds[0],
                'user_id'    => $userIds[1],
                'content'    => 'Increíble captura. La silueta tiene proporciones humanas definidas. ¿Cuál era la temperatura ambiente esa noche? Puede ayudar a descartar condensación en el objetivo.',
                'score'      => 12,
                'created_at' => now()->subDays(9),
                'updated_at' => now()->subDays(9),
            ],
            [
                'id'         => Str::uuid(),
                'report_id'  => $reportIds[0],
                'user_id'    => $userIds[2],
                'content'    => 'He revisado el vídeo tres veces. El movimiento no corresponde a ningún animal conocido en la zona. Las lecturas EMF coinciden con actividad registrada en otras localizaciones similares.',
                'score'      => 8,
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(8),
            ],
            // Comentarios del report 1
            [
                'id'         => Str::uuid(),
                'report_id'  => $reportIds[1],
                'user_id'    => $userIds[0],
                'content'    => 'Las grabaciones EVP son muy claras. Pasé el audio por Audacity y no detecté ningún tipo de edición. La respuesta del minuto 3:42 es especialmente llamativa.',
                'score'      => 15,
                'created_at' => now()->subDays(6),
                'updated_at' => now()->subDays(6),
            ],
            [
                'id'         => Str::uuid(),
                'report_id'  => $reportIds[1],
                'user_id'    => $userIds[4],
                'content'    => 'Estuve en ese monasterio el año pasado. El ala norte tiene una historia oscura que muy poca gente conoce. Os recomiendo investigar los registros históricos de 1847.',
                'score'      => 5,
                'created_at' => now()->subDays(6),
                'updated_at' => now()->subDays(6),
            ],
            // Comentarios del report 2
            [
                'id'         => Str::uuid(),
                'report_id'  => $reportIds[2],
                'user_id'    => $userIds[3],
                'content'    => 'Excelente análisis. Llevo años usando el modelo K2 y coincido con tus conclusiones. ¿Has probado el TriField TF2? Me parece más preciso en entornos con interferencias eléctricas.',
                'score'      => 20,
                'created_at' => now()->subDays(4),
                'updated_at' => now()->subDays(4),
            ],
            // Comentarios del report 3
            [
                'id'         => Str::uuid(),
                'report_id'  => $reportIds[3],
                'user_id'    => $userIds[0],
                'content'    => 'He ampliado la imagen y la figura parece tener ropa de época. El análisis de metadatos EXIF confirma que no hay edición posterior a la captura. Muy interesante.',
                'score'      => 18,
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            // Comentarios del report 4
            [
                'id'         => Str::uuid(),
                'report_id'  => $reportIds[4],
                'user_id'    => $userIds[2],
                'content'    => 'Participé en esta expedición. El descenso de temperatura que mencionáis fue brutal, de 18°C a 9°C en cuestión de segundos sin corriente de aire. Absolutamente inexplicable.',
                'score'      => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => Str::uuid(),
                'report_id'  => $reportIds[4],
                'user_id'    => $userIds[1],
                'content'    => 'El informe está muy bien documentado. ¿Tenéis pensado volver? Me gustaría unirme al siguiente grupo si organizáis otra expedición a esa localización.',
                'score'      => 9,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('comments')->insert($comments);
    }
}