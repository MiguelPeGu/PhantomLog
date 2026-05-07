<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ProductController
{
    public function index(Request $request): JsonResponse
    {
        // Solo las columnas necesarias para las tarjetas del catálogo
        // description, provider y sku no se muestran en el listado
        $query = Product::query()->select('id', 'title', 'price', 'stock', 'category', 'image', 'created_at')
            ->withCount('invoiceDetails');

        if ($request->has('search') && ! empty($request->search)) {
            /** @var string $searchTerm */
            $searchTerm = $request->search;
            $term = (string) $searchTerm;
            if (mb_strlen($term) >= 2) {
                $query->where(function (Builder $q) use ($term): void {
                    $q->where('title', 'like', '%'.$term.'%')
                        ->orWhere('provider', 'like', '%'.$term.'%')
                        ->orWhere('sku', 'like', '%'.$term.'%');
                });
            }
        }

        if ($request->has('category') && $request->category !== 'ALL') {
            $query->where('category', $request->category);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            if ($request->has('min_price') && $request->max_price < $request->min_price) {
                // Ignore invalid range or handle error
            } else {
                $query->where('price', '<=', $request->max_price);
            }
        }

        if ($request->has('sort')) {
            match ($request->sort) {
                'price_asc' => $query->orderBy('price', 'asc'),
                'price_desc' => $query->orderBy('price', 'desc'),
                'popular' => $query->orderByDesc('invoice_details_count')->orderBy('title', 'asc'),
                'newest' => $query->latest(),
                default => $query->latest(),
            };
        } else {
            $query->latest();
        }

        /** @var int $perPage */
        $perPage = $request->input('per_page', 9);

        return response()->json($query->paginate((int) $perPage));
    }

    public function store(Request $request): JsonResponse
    {
        /** @var array<string, mixed> $data */
        $data = $request->validate([
            'sku' => ['required', 'string', 'unique:products'],
            'title' => ['required', 'string', 'max:255'],
            'provider' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'tax' => ['required', 'integer', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'image' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
        ]);

        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'image') {
                $data[$key] = mb_trim(strip_tags($value));
            }
        }

        $product = Product::query()->create($data);

        return response()->json($product, 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json($product);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        /** @var array<string, mixed> $data */
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'provider' => ['sometimes', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'tax' => ['sometimes', 'integer', 'min:0'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'image' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
        ]);

        $product->update($data);

        return response()->json($product);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(null, 204);
    }

    public function related(Product $product): JsonResponse
    {
        $related = Product::query()
            ->select('id', 'title', 'price', 'stock', 'category', 'image')
            ->where('category', $product->category)
            ->where('id', '!=', $product->id)
            ->limit(20)
            ->get()
            ->shuffle()
            ->take(5);
    
        return response()->json($related);
    }
}
