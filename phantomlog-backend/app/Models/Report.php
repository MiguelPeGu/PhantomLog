<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Override;

/**
 * @property-read string $id
 * @property-read string $forum_id
 * @property-read string $user_id
 * @property-read string $title
 * @property-read string $description
 * @property-read string $image
 * @property-read int $score
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 * @property-read Forum $forum
 * @property-read User $user
 */
final class Report extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    use HasUuids;

    /**
     * @var list<string>
     */
    #[Override]
    protected $fillable = [
        'forum_id',
        'user_id',
        'title',
        'description',
        'image',
        'score',
    ];

    #[Override]
    protected $appends = ['votes_count', 'image_url'];

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

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function updateScore(): void
    {
        $this->score = $this->votes()->sum('value');
        $this->save();
    }

    protected static function booted(): void
    {
        self::created(function ($report): void {
            // Initial score is 0
        });

        // We use saved/deleted on the ReportVote model to update the Report score
    }

    protected function getVotesCountAttribute()
    {
        return $this->votes()->count();
    }

    protected function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        if (str_starts_with($this->image, 'http')) {
            return $this->image;
        }

        return asset('storage/'.$this->image);
    }
}
