<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Phantom;

/**
 * @property-read string $id
 * @property-read string $user_id
 *  * @property-read string $phantom_id
 * @property-read string $name
 * @property-read string $description
 * @property-read string $location
 * @property-read string $date
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class Expedition extends Model
{
    /** @use HasFactory<\Database\Factories\ExpeditionFactory> */
    use HasFactory;

    use HasUuids;

    /**
     * @var list<string>
     */
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function phantom()
    {
        return $this->belongsTo(Phantom::class);
    }
}
