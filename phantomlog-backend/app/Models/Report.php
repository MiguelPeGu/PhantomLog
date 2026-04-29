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
        'image',
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
            'image' => 'string',
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

    public function votes()
    {
        return $this->hasMany(ReportVote::class);
    }

    protected static function booted()
    {
        static::created(function ($report) {
            // Initial score is 0
        });

        // We use saved/deleted on the ReportVote model to update the Report score
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function updateScore()
    {
        $this->score = $this->votes()->sum('value');
        $this->save();
    }

    protected $appends = ['votes_count', 'image_url'];

    public function getVotesCountAttribute()
    {
        return $this->votes()->count();
    }

    public function getImageUrlAttribute()
    {
        if (!$this->image) return null;
        if (str_starts_with($this->image, 'http')) return $this->image;
        return asset('storage/' . $this->image);
    }
}
