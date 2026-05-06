<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expedition;
use Illuminate\Http\Request;

class ExpeditionController extends Controller
{
    public function index(Request $request)
    {
        // Columnas específicas para reducir el payload — las tarjetas no necesitan description completa
        $query = Expedition::select('id','user_id','phantom_id','name','location','date','created_at')
            ->with(['creator:id,username,img', 'phantom:id,name,type'])
            ->withCount('participants')
            ->latest();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('name', 'like', "%$s%")
                  ->orWhere('location', 'like', "%$s%")
                  ->orWhereHas('phantom', function($pq) use ($s) {
                      $pq->where('name', 'like', "%$s%");
                  });
            });
        }

        if ($request->filled('phantom_id') && $request->phantom_id !== 'ALL') {
            $query->where('phantom_id', $request->phantom_id);
        }

        return response()->json($query->paginate($request->get('per_page', 9)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'phantom_id'  => 'required|uuid|exists:phantoms,id',
            'name'        => ['required', 'string', 'min:5', 'max:100', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡]+$/'],
            'description' => 'required|string|min:100|max:2000',
            'location'    => ['required', 'string', 'max:40', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\-\/ºª]+$/'],
            'date'        => 'required|date|after:now',
        ], [
            'phantom_id.required' => 'Debes seleccionar una entidad objetivo válida.',
            'name.required' => 'El nombre de la misión es obligatorio.',
            'name.min' => 'El nombre de la misión debe tener al menos 5 caracteres.',
            'name.regex' => 'El nombre de la misión contiene caracteres no permitidos.',
            'description.required' => 'Los objetivos y descripción son obligatorios.',
            'description.min' => 'Los objetivos de la incursión deben ser más detallados (mínimo 100 caracteres).',
            'location.required' => 'La ubicación de la incursión es obligatoria.',
            'location.max' => 'La ubicación no puede exceder los 40 caracteres.',
            'location.regex' => 'La ubicación contiene caracteres especiales no permitidos.',
            'date.required' => 'La fecha y hora son obligatorias.',
            'date.after' => 'La incursión debe programarse para una fecha futura.',
        ]);

        // Sanitización manual
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = trim(strip_tags($value));
            }
        }

        $expedition = $request->user()->createdExpeditions()->create($data);

        return response()->json($expedition->load(['phantom', 'creator']), 201);
    }

    public function show(Expedition $expedition)
    {
        return response()->json(
            $expedition->load(['creator', 'phantom', 'participants'])
                ->loadCount('participants')
        );
    }

    public function update(Request $request, Expedition $expedition)
    {
        if ($request->user()->id !== $expedition->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $data = $request->validate([
            'phantom_id'  => 'sometimes|uuid|exists:phantoms,id',
            'name'        => ['sometimes', 'string', 'min:5', 'max:100', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡]+$/'],
            'description' => 'sometimes|string|min:100|max:2000',
            'location'    => ['sometimes', 'string', 'max:40', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\-\/ºª]+$/'],
            'date'        => 'sometimes|date|after:now',
        ], [
            'name.regex' => 'El nombre contiene caracteres no permitidos.',
            'description.min' => 'Los objetivos deben ser más detallados (mínimo 100 caracteres).',
            'location.max' => 'La ubicación no puede exceder los 40 caracteres.',
            'location.regex' => 'La ubicación contiene caracteres no permitidos.',
        ]);

        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = trim(strip_tags($value));
            }
        }

        $expedition->update($data);

        return response()->json($expedition->load(['phantom', 'creator']));
    }

    public function destroy(Request $request, Expedition $expedition)
    {
        if ($request->user()->id !== $expedition->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $expedition->delete();

        return response()->json(null, 204);
    }

    // Unirse / salir de una expedición
    public function toggleJoin(Request $request, Expedition $expedition)
    {
        if ($expedition->date < now()) {
            return response()->json(['message' => 'El registro para esta expedición ha finalizado.'], 403);
        }

        $request->user()->joinedExpeditions()->toggle($expedition->id);

        return response()->json([
            'message' => 'Ok',
            'is_joined' => $request->user()->joinedExpeditions()->where('expedition_id', $expedition->id)->exists()
        ]);
    }
}