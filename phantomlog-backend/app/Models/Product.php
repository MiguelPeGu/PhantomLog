<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\InvoiceDetail;


/**
 * @property int $id
 * @property string $sku
 * @property string $title
 * @property string $provider
 * @property float $price
 * @property int $tax
 * @property int $stock
 * @property string $image
 * @property string $description
 * @property CarbonInterface $created_at
 * @property CarbonInterface $updated_at
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
