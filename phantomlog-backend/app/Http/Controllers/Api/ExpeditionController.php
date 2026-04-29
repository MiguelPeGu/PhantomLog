<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expedition;
use Illuminate\Http\Request;

class ExpeditionController extends Controller
{
    public function index()
    {
        return response()->json(
            Expedition::with(['user', 'phantom'])
                ->withCount('participants')
                ->latest()
                ->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'phantom_id'  => 'required|uuid|exists:phantoms,id',
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'location'    => 'required|string',
            'date'        => 'required|date|after:now',
        ]);

        $expedition = $request->user()->createdExpeditions()->create($data);

        return response()->json($expedition->load(['phantom', 'user']), 201);
    }

    public function show(Expedition $expedition)
    {
        return response()->json(
            $expedition->load(['user', 'phantom', 'participants'])
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
            'name'        => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'location'    => 'sometimes|string',
            'date'        => 'sometimes|date|after:now',
        ]);

        $expedition->update($data);

        return response()->json($expedition->load(['phantom', 'user']));
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