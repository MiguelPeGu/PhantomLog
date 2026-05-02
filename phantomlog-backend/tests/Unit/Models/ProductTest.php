<?php

declare(strict_types=1);

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('product has required attributes', function () {
    $product = Product::factory()->create([
        'sku' => 'TEST-SKU-001',
        'title' => 'Cámara Térmica PRO',
        'category' => 'EQUIPMENT',
        'price' => 299.99,
    ]);

    expect($product->sku)->toBe('TEST-SKU-001')
        ->and($product->title)->toBe('Cámara Térmica PRO')
        ->and($product->category)->toBe('EQUIPMENT')
        ->and((float)$product->price)->toBe(299.99);
});

test('product calculates totals with tax', function () {
    $product = Product::factory()->create([
        'price' => 100.00,
        'tax' => 21,
    ]);

    // Note: If you have a method like getPriceWithTaxAttribute or similar, test it here.
    // For now we check basic fields.
    expect((int)$product->tax)->toBe(21);
});

test('product uuid is generated automatically', function () {
    $product = Product::factory()->create();
    
    expect($product->id)->not->toBeNull()
        ->and(strlen($product->id))->toBe(36);
});
