<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Phantom;
use Illuminate\Http\Request;

final class PhantomController extends Controller
{
    public function index(Request $request)
    {
        $query = Phantom::query()->withCount('expeditions')->latest();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s): void {
                $q->where('name', 'like', sprintf('%%%s%%', $s))
                    ->orWhere('type', 'like', sprintf('%%%s%%', $s));
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:3', 'max:100'],
            'type' => ['required', 'string', 'max:50'],
            'description' => ['required', 'string', 'max:2000'],
            'location' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'string'],
        ]);

        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'image') {
                $data[$key] = mb_trim(strip_tags($value));
            }
        }

        $phantom = Phantom::query()->create($data);

        return response()->json($phantom, 201);
    }

    public function show(string $phantom)
    {
        $record = Phantom::query()->findOrFail($phantom);

        return response()->json(
            $record->load('expeditions.creator')
        );
    }

    public function update(Request $request, Phantom $phantom)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'location' => ['sometimes', 'string'],
            'image' => ['nullable', 'string'],
        ]);

        $phantom->update($data);

        return response()->json($phantom);
    }

    public function destroy(Phantom $phantom)
    {
        $phantom->delete();

        return response()->json(null, 204);
    }
}
