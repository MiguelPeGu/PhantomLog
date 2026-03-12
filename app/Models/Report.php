<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Forum;
use App\Models\Comment;

/**
 * @property int $id
 * @property int $forum_id
 * @property int $user_id
 * @property string $title
 * @property string $description
 * @property int $score
 * @property CarbonInterface $created_at
 * @property CarbonInterface $updated_at
 * @property-read Forum $forum
 * @property-read User $user
 */
final class Report extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    use HasUuids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'forum_id',
        'user_id',
        'title',
        'description',
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
            'user_id' => 'string',
            'title' => 'string',
            'description' => 'string',
            'score' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function forum()
    {
        return $this->belongsTo(Forum::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
