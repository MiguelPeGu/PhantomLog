<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\Phantom;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class PhantomController
{
    public function index(Request $request): JsonResponse
    {
        $query = Phantom::query()->withCount('expeditions')->latest();

        if ($request->filled('search')) {
            /** @var string $searchTerm */
            $searchTerm = $request->search;
            $s = (string) $searchTerm;
            $query->where(function (Builder $q) use ($s): void {
                $q->where('name', 'like', sprintf('%%%s%%', $s))
                    ->orWhere('type', 'like', sprintf('%%%s%%', $s));
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        /** @var array<string, mixed> $data */
        $data = $request->validate([
            'name' => ['required', 'string', 'min:3', 'max:100'],
            'type' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:2000'],
            'location' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string'],
        ]);

        $description = $data['description'] ?? '';
        $location = $data['location'] ?? 'Unknown';
        $data['description'] = is_string($description) ? $description : '';
        $data['location'] = is_string($location) ? $location : 'Unknown';

        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'image') {
                $data[$key] = mb_trim(strip_tags($value));
            }
        }

        $phantom = Phantom::query()->create($data);

        return response()->json($phantom, 201);
    }

    public function show(string $phantom): JsonResponse
    {
        $record = Phantom::query()->findOrFail($phantom);

        return response()->json(
            $record->load('expeditions.creator')
        );
    }

    public function update(Request $request, Phantom $phantom): JsonResponse
    {
        /** @var array<string, mixed> $data */
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

    public function destroy(Phantom $phantom): JsonResponse
    {
        $phantom->delete();

        return response()->json(null, 204);
    }
}
