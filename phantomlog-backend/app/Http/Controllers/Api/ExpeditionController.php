<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\Expedition;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ExpeditionController
{
    public function index(Request $request): JsonResponse
    {
        $query = Expedition::query()->select('id', 'user_id', 'phantom_id', 'name', 'location', 'date', 'created_at')
            ->with(['creator:id,username,img', 'phantom:id,name,type'])
            ->withCount('participants')
            ->latest();

        if ($request->filled('search')) {
            /** @var string $searchTerm */
            $searchTerm = $request->search;
            $s = (string) $searchTerm;
            $query->where(function (Builder $q) use ($s): void {
                $q->where('name', 'like', sprintf('%%%s%%', $s))
                    ->orWhere('location', 'like', sprintf('%%%s%%', $s))
                    ->orWhereHas('phantom', function (Builder $pq) use ($s): void {
                        $pq->where('name', 'like', sprintf('%%%s%%', $s));
                    });
            });
        }

        if ($request->filled('phantom_id') && $request->phantom_id !== 'ALL') {
            $query->where('phantom_id', $request->phantom_id);
        }

        /** @var int $perPage */
        $perPage = $request->get('per_page', 9);

        return response()->json($query->paginate((int) $perPage));
    }

    public function store(Request $request): JsonResponse
    {
        /** @var array<string, mixed> $data */
        $data = $request->validate([
            'phantom_id' => ['required', 'uuid', 'exists:phantoms,id'],
            'name' => ['required', 'string', 'min:5', 'max:100', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡]+$/'],
            'description' => ['required', 'string', 'min:5', 'max:2000'],
            'location' => ['required', 'string', 'max:40', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\-\/ºª]+$/'],
            'date' => ['required', 'date', 'after:now'],
        ], [
            'phantom_id.required' => 'Debes seleccionar una entidad objetivo válida.',
            'name.required' => 'El nombre de la misión es obligatorio.',
            'name.min' => 'El nombre de la misión debe tener al menos 5 caracteres.',
            'name.regex' => 'El nombre de la misión contiene caracteres no permitidos.',
            'description.required' => 'Los objetivos y descripción son obligatorios.',
            'description.min' => 'Los objetivos de la incursion deben ser mas detallados (minimo 5 caracteres).',
            'location.required' => 'La ubicación de la incursión es obligatoria.',
            'location.max' => 'La ubicación no puede exceder los 40 caracteres.',
            'location.regex' => 'La ubicación contiene caracteres especiales no permitidos.',
            'date.required' => 'La fecha y hora son obligatorias.',
            'date.after' => 'La incursión debe programarse para una fecha futura.',
        ]);

        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = mb_trim(strip_tags($value));
            }
        }

        $user = $request->user();
        assert($user instanceof User);
        $expedition = $user->createdExpeditions()->create($data);

        // El creador participa automáticamente
        $user->joinedExpeditions()->attach($expedition->id);

        return response()->json($expedition->load(['phantom', 'creator']), 201);
    }

    public function show(Expedition $expedition): JsonResponse
    {
        return response()->json(
            $expedition->load(['creator', 'phantom', 'participants'])
                ->loadCount('participants')
        );
    }

    public function update(Request $request, Expedition $expedition): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        if ($user->id !== $expedition->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        /** @var array<string, mixed> $data */
        $data = $request->validate([
            'phantom_id' => ['sometimes', 'uuid', 'exists:phantoms,id'],
            'name' => ['sometimes', 'string', 'min:5', 'max:100', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡]+$/'],
            'description' => ['sometimes', 'string', 'min:100', 'max:2000'],
            'location' => ['sometimes', 'string', 'max:40', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\-\/ºª]+$/'],
            'date' => ['sometimes', 'date', 'after:now'],
        ], [
            'name.regex' => 'El nombre contiene caracteres no permitidos.',
            'description.min' => 'Los objetivos deben ser más detallados (mínimo 100 caracteres).',
            'location.max' => 'La ubicación no puede exceder los 40 caracteres.',
            'location.regex' => 'La ubicación contiene caracteres no permitidos.',
        ]);

        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = mb_trim(strip_tags($value));
            }
        }

        $expedition->update($data);

        return response()->json($expedition->load(['phantom', 'creator']));
    }

    public function destroy(Request $request, Expedition $expedition): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        if ($user->id !== $expedition->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $expedition->delete();

        return response()->json(null, 204);
    }

    // Unirse / salir de una expedición
    public function toggleJoin(Request $request, Expedition $expedition): JsonResponse
    {
        if ($expedition->date < now()) {
            return response()->json(['message' => 'El registro para esta expedición ha finalizado.'], 403);
        }

        $user = $request->user();
        assert($user instanceof User);

        $user->joinedExpeditions()->toggle($expedition->id);

        return response()->json([
            'message' => 'Ok',
            'is_joined' => $user->joinedExpeditions()->where('expedition_id', $expedition->id)->exists(),
        ]);
    }
}
