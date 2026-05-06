<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\Product;
use Illuminate\Database\Seeder;

final class InvoiceDetailSeeder extends Seeder
{
    public function run(): void
    {
        $invoices = Invoice::all();

        $emf = Product::query()->where('sku', 'EQ-EMF-K2')->first();
        $evp = Product::query()->where('sku', 'EQ-EVP-DIG')->first();
        $camara = Product::query()->where('sku', 'EQ-CAM-THERM')->first();
        $kit = Product::query()->where('sku', 'EQ-DOTS-PRO')->first();
        $pills = Product::query()->where('sku', 'EQ-PILL-SANITY')->first();

        $details = [
            // Factura 0 → EMF x2 + Termómetro x1
            [
                'invoice' => $invoices[0],
                'product' => $emf,
                'quantity' => 2,
            ],
            [
                'invoice' => $invoices[0],
                'product' => $pills,
                'quantity' => 1,
            ],
            // Factura 1 → Cámara Térmica x1
            [
                'invoice' => $invoices[1],
                'product' => $camara,
                'quantity' => 1,
            ],
            // Factura 2 → Kit completo x1 + Grabadora EVP x1
            [
                'invoice' => $invoices[2],
                'product' => $kit,
                'quantity' => 1,
            ],
            [
                'invoice' => $invoices[2],
                'product' => $evp,
                'quantity' => 1,
            ],
        ];

        foreach ($details as $data) {
            $invoice = $data['invoice'];
            $product = $data['product'];
            $quantity = $data['quantity'];
            $total = round($product->price * $quantity, 2);

            $invoice->details()->create([
                'product_id' => $product->id,
                'sku' => $product->sku,
                'title' => $product->title,
                'price' => $product->price,
                'tax' => $product->tax,
                'quantity' => $quantity,
                'total' => $total,
                'total_with_tax' => round($total * (1 + $product->tax / 100), 2),
            ]);
        }
    }
}
