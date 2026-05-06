<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Services\CartService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final readonly class CartController
{
    public function __construct(private CartService $cartService) {}

    public function index(): JsonResponse
    {
        return $this->cartResponse();
    }

    public function add(Request $request, Product $product): JsonResponse
    {
        $quantity = $request->integer('quantity', 1);

        try {
            $this->cartService->add($product, $quantity);

            return $this->cartResponse();
        } catch (Exception $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }
    }

    public function subtract(Product $product): JsonResponse
    {
        $this->cartService->subtract($product);

        return $this->cartResponse();
    }

    public function remove(Product $product): JsonResponse
    {
        $this->cartService->remove($product->id);

        return $this->cartResponse();
    }

    public function clear(): JsonResponse
    {
        $this->cartService->clear();

        return $this->cartResponse();
    }

    private function cartResponse(): JsonResponse
    {
        return response()->json([
            'items' => array_values($this->cartService->getCart()),
            'totalWithTax' => $this->cartService->getTotalWithTax(),
            'totalWithoutTax' => $this->cartService->getTotalWithoutTax(),
        ]);
    }
}
