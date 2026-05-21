<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Product;
use Exception;

final class CartService
{
    /**
     * @var array<string, array{product: Product, quantity: int}>
     */
    private array $cart = [];

    /**
     * Get the cart from session.
     * Use Product id as key, and an array with product details and quantity.
     *
     * @return array<string, array{product: Product, quantity: int}>
     */
    public function getCart(): array
    {
        $userId = auth()->id();
        if (! $userId) {
            return $this->cart;
        }

        /** @var array<string, array{product: Product|array<mixed>, quantity: int}> $cart */
        $cart = cache()->get('cart_'.$userId, []);

        foreach ($cart as $id => $item) {
            if (is_array($item['product'])) {
                $product = Product::query()->find($id);
                if ($product instanceof Product) {
                    $cart[$id]['product'] = $product;
                } else {
                    unset($cart[$id]);
                }
            }
        }

        /** @var array<string, array{product: Product, quantity: int}> $cart */
        return $cart;
    }

    public function add(Product $product, int $quantity = 1): void
    {
        $cart = $this->getCart();
        $id = (string) $product->id;

        $currentQuantity = isset($cart[$id]) ? $cart[$id]['quantity'] : 0;

        throw_if(($currentQuantity + $quantity) > $product->stock, Exception::class, 'Stock insuficiente para este artefacto sagrado.');

        if (isset($cart[$id])) {
            $cart[$id]['quantity'] += $quantity;
        } else {
            $cart[$id] = [
                'product' => $product,
                'quantity' => $quantity,
            ];
        }

        $this->saveCart($cart);
    }

    public function subtract(Product $product, int $quantity = 1): void
    {
        $cart = $this->getCart();
        $id = (string) $product->id;

        if (isset($cart[$id])) {
            $cart[$id]['quantity'] -= $quantity;

            if ($cart[$id]['quantity'] <= 0) {
                unset($cart[$id]);
            }
        }

        $this->saveCart($cart);
    }

    public function remove(string $productId): void
    {
        $cart = $this->getCart();
        unset($cart[$productId]);
        $this->saveCart($cart);
    }

    public function clear(): void
    {
        $this->saveCart([]);
    }

    public function getTotalWithTax(): float
    {
        $cart = $this->getCart();
        $total = 0;

        foreach ($cart as $item) {
            $product = $item['product'];
            $quantity = $item['quantity'];

            $priceWithTax = (float) ($product->price) * (1 + ((int) ($product->tax) / 100));
            $total += $priceWithTax * $quantity;
        }

        return (float) $total;
    }

    public function getTotalWithoutTax(): float
    {
        $cart = $this->getCart();
        $total = 0;

        foreach ($cart as $item) {
            $product = $item['product'];
            $quantity = $item['quantity'];
            $total += (float) ($product->price) * $quantity;
        }

        return (float) $total;
    }

    /**
     * @param  array<string, array{product: Product, quantity: int}>  $cart
     */
    private function saveCart(array $cart): void
    {
        $this->cart = $cart;
        if (auth()->id()) {
            cache()->put('cart_'.auth()->id(), $cart, now()->addDays(7));
        }
    }
}
