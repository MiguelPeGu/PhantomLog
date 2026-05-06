<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<InvoiceDetail>
 */
final class InvoiceDetailFactory extends Factory
{
    public function definition(): array
    {
        $product = Product::factory()->create();
        $quantity = $this->faker->numberBetween(1, 10);
        $price = (float) ($product->price);
        $total = $price * $quantity;
        $taxRate = (int) ($product->tax);
        $totalWithTax = $total * (1 + $taxRate / 100);

        /**
         * Define the model's default state.
         *
         * @return array<string, mixed>
         */
        return [
            'id' => (string) Str::uuid(),
            'invoice_id' => Invoice::factory(),
            'product_id' => $product->id,
            'sku' => $product->sku,
            'title' => $product->title,
            'price' => $price,
            'tax' => $taxRate,
            'quantity' => $quantity,
            'total' => $total,
            'total_with_tax' => $totalWithTax,
        ];
    }
}
