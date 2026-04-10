<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(
            Product::latest()->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'sku'         => 'required|string|unique:products',
            'title'       => 'required|string|max:255',
            'provider'    => 'required|string',
            'price'       => 'required|numeric|min:0',
            'tax'         => 'required|integer|min:0',
            'stock'       => 'required|integer|min:0',
            'image'       => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $product = Product::create($data);

        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'provider'    => 'sometimes|string',
            'price'       => 'sometimes|numeric|min:0',
            'tax'         => 'sometimes|integer|min:0',
            'stock'       => 'sometimes|integer|min:0',
            'image'       => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $product->update($data);

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(null, 204);
    }
}