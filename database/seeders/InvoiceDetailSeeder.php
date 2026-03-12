<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InvoiceDetailSeeder extends Seeder
{
    public function run(): void
    {
        $invoices = DB::table('invoices')->orderBy('created_at')->get();
        $products = DB::table('products')->get()->keyBy('sku');

        $emf      = $products['8410000001234'];
        $evp      = $products['8410000002345'];
        $camara   = $products['8410000003456'];
        $kit      = $products['8410000005678'];
        $termo    = $products['8410000006789'];

        $details = [
            // Factura 0 → 2 productos: EMF + Grabadora EVP
            [
                'id'             => Str::uuid(),
                'invoice_id'     => $invoices[0]->id,
                'product_id'     => $emf->id,
                'sku'            => $emf->sku,
                'title'          => $emf->title,
                'price'          => $emf->price,
                'tax'            => $emf->tax,
                'quantity'       => 2,
                'total'          => round($emf->price * 2, 2),
                'total_with_tax' => round($emf->price * 2 * (1 + $emf->tax / 100), 2),
                'created_at'     => now()->subDays(20),
                'updated_at'     => now()->subDays(20),
            ],
            [
                'id'             => Str::uuid(),
                'invoice_id'     => $invoices[0]->id,
                'product_id'     => $termo->id,
                'sku'            => $termo->sku,
                'title'          => $termo->title,
                'price'          => $termo->price,
                'tax'            => $termo->tax,
                'quantity'       => 1,
                'total'          => round($termo->price, 2),
                'total_with_tax' => round($termo->price * (1 + $termo->tax / 100), 2),
                'created_at'     => now()->subDays(20),
                'updated_at'     => now()->subDays(20),
            ],
            // Factura 1 → Cámara Térmica
            [
                'id'             => Str::uuid(),
                'invoice_id'     => $invoices[1]->id,
                'product_id'     => $camara->id,
                'sku'            => $camara->sku,
                'title'          => $camara->title,
                'price'          => $camara->price,
                'tax'            => $camara->tax,
                'quantity'       => 1,
                'total'          => round($camara->price, 2),
                'total_with_tax' => round($camara->price * (1 + $camara->tax / 100), 2),
                'created_at'     => now()->subDays(15),
                'updated_at'     => now()->subDays(15),
            ],
            // Factura 2 → Kit completo + Grabadora EVP
            [
                'id'             => Str::uuid(),
                'invoice_id'     => $invoices[2]->id,
                'product_id'     => $kit->id,
                'sku'            => $kit->sku,
                'title'          => $kit->title,
                'price'          => $kit->price,
                'tax'            => $kit->tax,
                'quantity'       => 1,
                'total'          => round($kit->price, 2),
                'total_with_tax' => round($kit->price * (1 + $kit->tax / 100), 2),
                'created_at'     => now()->subDays(10),
                'updated_at'     => now()->subDays(10),
            ],
            [
                'id'             => Str::uuid(),
                'invoice_id'     => $invoices[2]->id,
                'product_id'     => $evp->id,
                'sku'            => $evp->sku,
                'title'          => $evp->title,
                'price'          => $evp->price,
                'tax'            => $evp->tax,
                'quantity'       => 1,
                'total'          => round($evp->price, 2),
                'total_with_tax' => round($evp->price * (1 + $evp->tax / 100), 2),
                'created_at'     => now()->subDays(10),
                'updated_at'     => now()->subDays(10),
            ],
        ];

        DB::table('invoice_details')->insert($details);
    }
}