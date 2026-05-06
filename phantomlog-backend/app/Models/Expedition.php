<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\ExpeditionFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Override;

/**
 * @property-read string $id
 * @property-read string $user_id
 * @property-read string $phantom_id
 * @property-read string $name
 * @property-read string $description
 * @property-read string $location
 * @property-read CarbonInterface $date
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class Expedition extends Model
{
    /** @use HasFactory<ExpeditionFactory> */
    use HasFactory;

    use HasUuids;

    /**
     * @var list<string>
     */
    #[Override]
    protected $fillable = [
        'user_id',
        'phantom_id',
        'name',
        'description',
        'location',
        'date',
    ];

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'id' => 'string',
            'user_id' => 'string',
            'phantom_id' => 'string',
            'name' => 'string',
            'description' => 'string',
            'location' => 'string',
            'date' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** @return BelongsToMany<User, $this> */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'enrollment');
    }

    /** @return BelongsTo<Phantom, $this> */
    public function phantom(): BelongsTo
    {
        return $this->belongsTo(Phantom::class);
    }
}
