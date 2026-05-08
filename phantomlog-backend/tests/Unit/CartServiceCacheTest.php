<?php

declare(strict_types=1);

use App\Models\Product;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->service = resolve(CartService::class);
});

it('throws when adding quantity beyond stock', function (): void {
    $product = Product::factory()->make(['id' => 'p-stock', 'stock' => 1, 'price' => 100, 'tax' => 21]);

    $this->service->add($product, 1);

    expect(fn (): mixed => $this->service->add($product, 1))
        ->toThrow(Exception::class, 'Stock insuficiente para este artefacto sagrado.');
});

it('stores cart in cache for authenticated user', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = Product::factory()->make(['id' => 'p-cache', 'stock' => 10, 'price' => 50, 'tax' => 21]);
    $this->service->add($product, 2);

    /** @var array<string, array{product: Product, quantity: int}> $cached */
    $cached = cache()->get('cart_'.$user->id, []);

    expect($cached)->toHaveKey('p-cache');
    expect($cached['p-cache']['quantity'])->toBe(2);
});
