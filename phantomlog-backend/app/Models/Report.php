<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\ReportFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Override;

/**
 * @property-read string $id
 * @property-read string $forum_id
 * @property-read string $user_id
 * @property-read string $title
 * @property-read string $description
 * @property-read string $image
 * @property int $score
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 * @property-read Forum $forum
 * @property-read User $user
 */
final class Report extends Model
{
    /** @use HasFactory<ReportFactory> */
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

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Forum, $this> */
    public function forum(): BelongsTo
    {
        return $this->belongsTo(Forum::class);
    }

    /** @return HasMany<ReportVote, $this> */
    public function votes(): HasMany
    {
        return $this->hasMany(ReportVote::class);
    }

    /** @return HasMany<Comment, $this> */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function updateScore(): void
    {
        $this->score = (int) $this->votes()->sum('value'); // suma aritmetica
        $this->save();
    }

    protected static function booted(): void
    {
        self::created(function (Report $report): void {});
    }

    protected function getVotesCountAttribute(): int
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
