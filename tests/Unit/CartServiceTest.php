<?php

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Support\Facades\Session;

beforeEach(function () {
    $this->service = app(CartService::class);
});

it('can add a product to the cart', function () {
    $product = Product::factory()->make(['id' => '1', 'price' => 100, 'tax' => 21]);
    
    $this->service->add($product, 1);
    
    $cart = $this->service->getCart();
    expect($cart)->toHaveKey('1');
    expect($cart['1']['quantity'])->toBe(1);
    expect($cart['1']['product']->id)->toBe('1');
});

it('increases quantity if product is already in cart', function () {
    $product = Product::factory()->make(['id' => '1', 'price' => 100, 'tax' => 21]);
    
    $this->service->add($product, 1);
    $this->service->add($product, 2);
    
    $cart = $this->service->getCart();
    expect($cart['1']['quantity'])->toBe(3);
});

it('can subtract quantity from the cart', function () {
    $product = Product::factory()->make(['id' => '1', 'price' => 100, 'tax' => 21]);
    
    $this->service->add($product, 3);
    $this->service->subtract($product, 1);
    
    $cart = $this->service->getCart();
    expect($cart['1']['quantity'])->toBe(2);
});

it('removes product from cart if subtracted quantity goes below 1', function () {
    $product = Product::factory()->make(['id' => '1', 'price' => 100, 'tax' => 21]);
    
    $this->service->add($product, 1);
    $this->service->subtract($product, 1);
    
    $cart = $this->service->getCart();
    expect($cart)->toBeEmpty();
});

it('can clear the cart completely', function () {
    $product = Product::factory()->make(['id' => '1', 'price' => 100, 'tax' => 21]);
    
    $this->service->add($product, 1);
    $this->service->clear();
    
    $cart = $this->service->getCart();
    expect($cart)->toBeEmpty();
});

it('calculates total without tax correctly', function () {
    $product1 = Product::factory()->make(['id' => '1', 'price' => 100, 'tax' => 21]);
    $product2 = Product::factory()->make(['id' => '2', 'price' => 50, 'tax' => 21]);
    
    $this->service->add($product1, 2); // 200
    $this->service->add($product2, 1); // 50
    
    $total = $this->service->getTotalWithoutTax();
    expect($total)->toBe(250.0);
});

it('calculates total with tax correctly', function () {
    // 100 + 21% = 121
    $product = Product::factory()->make(['id' => '1', 'price' => 100, 'tax' => 21]);
    
    $this->service->add($product, 2); // 121 * 2 = 242
    
    $total = $this->service->getTotalWithTax();
    expect($total)->toBe(242.0);
});
