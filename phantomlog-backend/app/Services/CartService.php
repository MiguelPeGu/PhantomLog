<?php

namespace App\Services;

use App\Models\Product;

class CartService
{
    /**
     * Get the cart from session.
     * Use Product id as key, and an array with product details and quantity.
     * 
     * @return array<string, array{product: Product, quantity: int}>
     */
    public function getCart(): array
    {
        $userId = auth()->id();
        if (!$userId) return [];
        return cache()->get('cart_' . $userId, []);
    }

    public function add(Product $product, int $quantity = 1): void
    {
        $cart = $this->getCart();
        $id = $product->id;
        
        $currentQuantity = isset($cart[$id]) ? $cart[$id]['quantity'] : 0;
        
        if (($currentQuantity + $quantity) > $product->stock) {
            throw new \Exception("Stock insuficiente para este artefacto sagrado.");
        }

        if (isset($cart[$id])) {
            $cart[$id]['quantity'] += $quantity;
        } else {
            $cart[$id] = [
                'product' => $product,
                'quantity' => $quantity,
            ];
        }

        if (auth()->id()) {
            cache()->put('cart_' . auth()->id(), $cart, now()->addDays(7));
        }
    }

    public function subtract(Product $product, int $quantity = 1): void
    {
        $cart = $this->getCart();
        $id = $product->id;

        if (isset($cart[$id])) {
            $cart[$id]['quantity'] -= $quantity;

            if ($cart[$id]['quantity'] <= 0) {
                unset($cart[$id]);
            }
        }

        if (auth()->id()) {
            cache()->put('cart_' . auth()->id(), $cart, now()->addDays(7));
        }
    }

    public function remove(string $productId): void
    {
        $cart = $this->getCart();

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
        }

        if (auth()->id()) {
            cache()->put('cart_' . auth()->id(), $cart, now()->addDays(7));
        }
    }

    public function clear(): void
    {
        if (auth()->id()) {
            cache()->forget('cart_' . auth()->id());
        }
    }

    public function getTotalWithTax(): float
    {
        $cart = $this->getCart();
        $total = 0;

        foreach ($cart as $item) {
            $product = $item['product'];
            $quantity = $item['quantity'];
            
            $priceWithTax = $product->price * (1 + ($product->tax / 100));
            $total += $priceWithTax * $quantity;
        }

        return $total;
    }

    public function getTotalWithoutTax(): float
    {
        $cart = $this->getCart();
        $total = 0;

        foreach ($cart as $item) {
            $product = $item['product'];
            $quantity = $item['quantity'];
            $total += $product->price * $quantity;
        }

        return $total;
    }
}
