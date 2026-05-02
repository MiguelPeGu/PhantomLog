<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::withCount('invoiceDetails');

        if ($request->has('search') && !empty($request->search)) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('title', 'like', '%' . $term . '%')
                  ->orWhere('description', 'like', '%' . $term . '%')
                  ->orWhere('provider', 'like', '%' . $term . '%');
            });
        }

        if ($request->has('category') && $request->category !== 'ALL') {
            $query->where('category', $request->category);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'popular':
                    $query->orderByDesc('invoice_details_count')->orderBy('title', 'asc');
                    break;
                case 'newest':
                    $query->latest();
                    break;
                default:
                    $query->latest();
                    break;
            }
        } else {
            $query->latest();
        }

        return response()->json($query->paginate($request->input('per_page', 9)));
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