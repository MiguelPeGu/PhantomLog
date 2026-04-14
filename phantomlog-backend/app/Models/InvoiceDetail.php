<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\Invoice;

/**
 * @property-read string $id
 * @property-read string $invoice_id
 * @property-read string $product_id
 * @property-read string $sku
 * @property-read string $title
 * @property-read decimal $price
 * @property-read int $tax
 * @property-read int $quantity
 * @property-read decimal $total
 * @property-read decimal $total_with_tax
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class InvoiceDetail extends Model
{
    /** @use HasFactory<\Database\Factories\InvoiceDetailFactory> */
    use HasFactory;

    use HasUuids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'invoice_id',
        'product_id',
        'sku',
        'title',
        'price',
        'tax',
        'quantity',
        'total',
        'total_with_tax',
    ];

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'id' => 'string',
            'invoice_id' => 'string',
            'product_id' => 'string',
            'sku' => 'string',
            'title' => 'string',
            'price' => 'decimal:2',
            'tax' => 'integer',
            'quantity' => 'integer',
            'total' => 'decimal:2',
            'total_with_tax' => 'decimal:2',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
