<?php

namespace Database\Seeders;

use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $users   = User::all();
        $reports = Report::all();

        $comments = [
            [
                'report'  => $reports[0],
                'user_id' => $users[1]->id,
                'content' => 'Increíble captura. La silueta tiene proporciones humanas definidas. ¿Cuál era la temperatura ambiente esa noche? Puede ayudar a descartar condensación en el objetivo.',
                'score'   => 12,
            ],
            [
                'report'  => $reports[0],
                'user_id' => $users[2]->id,
                'content' => 'He revisado el vídeo tres veces. El movimiento no corresponde a ningún animal conocido en la zona. Las lecturas EMF coinciden con actividad registrada en localizaciones similares.',
                'score'   => 8,
            ],
            [
                'report'  => $reports[1],
                'user_id' => $users[0]->id,
                'content' => 'Las grabaciones EVP son muy claras. Pasé el audio por Audacity y no detecté ninguna edición. La respuesta del minuto 3:42 es especialmente llamativa.',
                'score'   => 15,
            ],
            [
                'report'  => $reports[1],
                'user_id' => $users[4]->id,
                'content' => 'Estuve en ese monasterio el año pasado. El ala norte tiene una historia oscura que muy poca gente conoce. Os recomiendo investigar los registros históricos de 1847.',
                'score'   => 5,
            ],
            [
                'report'  => $reports[2],
                'user_id' => $users[3]->id,
                'content' => 'Excelente análisis. Llevo años usando el K2 y coincido con tus conclusiones. ¿Has probado el TriField TF2? Me parece más preciso en entornos con interferencias eléctricas.',
                'score'   => 20,
            ],
            [
                'report'  => $reports[3],
                'user_id' => $users[0]->id,
                'content' => 'He ampliado la imagen y la figura parece tener ropa de época. El análisis de metadatos EXIF confirma que no hay edición posterior a la captura. Muy interesante.',
                'score'   => 18,
            ],
            [
                'report'  => $reports[4],
                'user_id' => $users[2]->id,
                'content' => 'Participé en esta expedición. El descenso de temperatura fue brutal, de 18°C a 9°C en cuestión de segundos sin corriente de aire. Absolutamente inexplicable.',
                'score'   => 30,
            ],
            [
                'report'  => $reports[4],
                'user_id' => $users[1]->id,
                'content' => 'El informe está muy bien documentado. ¿Tenéis pensado volver? Me gustaría unirme al siguiente grupo si organizáis otra expedición a esa localización.',
                'score'   => 9,
            ],
        ];

        foreach ($comments as $comment) {
            $report = $comment['report'];
            $report->comments()->create([
                'user_id' => $comment['user_id'],
                'content' => $comment['content'],
                'score'   => $comment['score'],
            ]);
        }
    }
}