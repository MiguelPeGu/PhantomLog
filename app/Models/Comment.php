<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\User;
use App\Models\Report;
/**
 * @property-read string $id
 * @property-read string $report_id
 * @property-read string $user_id
 * @property-read string $content
 * @property-read integer $score
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
class Comment extends Model
{
    /** @use HasFactory<\Database\Factories\CommentFactory> */
    use HasFactory;
    use HasUuids;

    /**
     * @var list<string>
     */
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

