<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\CommentFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Override;

/**
 * @property-read string $id
 * @property-read string $report_id
 * @property-read string $user_id
 * @property-read string $content
 * @property-read int $score
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class Comment extends Model
{
    /** @use HasFactory<CommentFactory> */
    use HasFactory;

    use HasUuids;

    /**
     * @var list<string>
     */
    #[Override]
    protected $fillable = [
        'report_id',
        'user_id',
        'content',
        'score',
    ];

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'id' => 'string',
            'forum_id' => 'string',
            'report_id' => 'string',
            'user_id' => 'string',
            'content' => 'string',
            'score' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function report()
    {
        return $this->belongsTo(Report::class);
    }
}
