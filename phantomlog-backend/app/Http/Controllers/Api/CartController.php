<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(private CartService $cartService)
    {
    }

    public function index()
    {
        return $this->cartResponse();
    }

    private function cartResponse()
    {
        return response()->json([
            'items' => array_values($this->cartService->getCart()),
            'totalWithTax' => $this->cartService->getTotalWithTax(),
            'totalWithoutTax' => $this->cartService->getTotalWithoutTax(),
        ]);
    }

    public function add(Request $request, Product $product)
    {
        $quantity = (int) $request->input('quantity', 1);

        try {
            $this->cartService->add($product, $quantity);
            return $this->cartResponse();
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function subtract(Product $product)
    {
        $this->cartService->subtract($product);
        return $this->cartResponse();
    }

    public function remove(Product $product)
    {
        $this->cartService->remove($product->id);
        return $this->cartResponse();
    }

    public function clear()
    {
        $this->cartService->clear();
        return $this->cartResponse();
    }
}
