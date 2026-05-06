<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\InvoiceDetail;


use Carbon\CarbonInterface;

/**
 * @property-read string $id
 * @property-read string $sku
 * @property-read string $title
 * @property-read string $provider
 * @property-read string $price
 * @property-read int $tax
 * @property-read int $stock
 * @property-read string $category
 * @property-read string $image
 * @property-read string $description
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    use HasUuids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'sku',
        'title',
        'provider',
        'price',
        'tax',
        'stock',
        'category',
        'image',
        'description',
    ];

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'id' => 'string',
            'sku' => 'string',
            'title' => 'string',
            'provider' => 'string',
            'price' => 'decimal:2',
            'tax' => 'integer',
            'stock' => 'integer',
            'image' => 'string',
            'description' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function invoiceDetails()
    {
        return $this->hasMany(InvoiceDetail::class);
    }
}
