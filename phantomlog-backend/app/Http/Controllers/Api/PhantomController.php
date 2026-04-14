<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Phantom;
use Illuminate\Http\Request;

class PhantomController extends Controller
{
    public function index()
    {
        return response()->json(
            Phantom::withCount('expeditions')->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'type'        => 'required|string|max:255',
            'description' => 'required|string',
            'location'    => 'required|string',
            'image'       => 'nullable|string',
        ]);

        $phantom = Phantom::create($data);

        return response()->json($phantom, 201);
    }

    public function show(Phantom $phantom)
    {
        return response()->json(
            $phantom->load('expeditions.user')
        );
    }

    public function update(Request $request, Phantom $phantom)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'type'        => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'location'    => 'sometimes|string',
            'image'       => 'nullable|string',
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