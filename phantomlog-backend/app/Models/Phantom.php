<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\PhantomFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Override;

/**
 * @property-read string $id
 * @property-read string $name
 * @property-read string $type
 * @property-read string $description
 * @property-read string $strengths
 * @property-read string $weaknesses
 * @property-read string $evidence
 * @property-read string $location
 * @property-read string $image
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class Phantom extends Model
{
    /** @use HasFactory<PhantomFactory> */
    use HasFactory;

    use HasUuids;

    /**
     * @var list<string>
     */
    #[Override]
    protected $fillable = [
        'name',
        'type',
        'description',
        'strengths',
        'weaknesses',
        'evidence',
        'location',
        'image',
    ];

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'id' => 'string',
            'name' => 'string',
            'type' => 'string',
            'description' => 'string',
            'strengths' => 'string',
            'weaknesses' => 'string',
            'evidence' => 'string',
            'location' => 'string',
            'image' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function expeditions()
    {
        return $this->hasMany(Expedition::class);
    }
}
