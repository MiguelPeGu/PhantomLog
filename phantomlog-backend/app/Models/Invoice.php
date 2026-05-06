<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\InvoiceFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Override;

/**
 * @property-read string $id
 * @property-read string $n_invoice
 * @property-read string $user_id
 * @property-read string $dni
 * @property-read string $first_name
 * @property-read string $last_name
 * @property-read string $address
 * @property-read string $postal_code
 * @property-read string $payment_method
 * @property-read int $tax
 * @property-read string $total
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class Invoice extends Model
{
    /** @use HasFactory<InvoiceFactory> */
    use HasFactory;

    use HasUuids;

    /**
     * @var list<string>
     */
    #[Override]
    protected $fillable = [
        'n_invoice',
        'user_id',
        'dni',
        'first_name',
        'last_name',
        'address',
        'postal_code',
        'tax',
        'total',
        'payment_method',
    ];

    #[Override]
    protected $appends = ['subtotal'];

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'id' => 'string',
            'n_invoice' => 'string',
            'user_id' => 'string',
            'dni' => 'string',
            'first_name' => 'string',
            'last_name' => 'string',
            'address' => 'string',
            'tax' => 'integer',
            'total' => 'decimal:2',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function details()
    {
        return $this->hasMany(InvoiceDetail::class);
    }

    protected function getSubtotalAttribute(): int|float
    {
        return $this->total / (1 + ($this->tax / 100));
    }
}
