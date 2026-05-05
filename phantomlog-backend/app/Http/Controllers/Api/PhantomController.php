<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Phantom;
use Illuminate\Http\Request;

class PhantomController extends Controller
{
    public function index(Request $request)
    {
        $query = Phantom::withCount('expeditions')->latest();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('name', 'like', "%$s%")
                  ->orWhere('type', 'like', "%$s%");
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|min:3|max:100',
            'type'        => 'required|string|max:50',
            'description' => 'required|string|max:2000',
            'location'    => 'required|string|max:255',
            'image'       => 'nullable|string',
        ]);

        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'image') {
                $data[$key] = trim(strip_tags($value));
            }
        }

        $phantom = Phantom::create($data);

        return response()->json($phantom, 201);
    }

    public function show(string $phantom)
    {
        $record = Phantom::findOrFail($phantom);
        return response()->json(
            $record->load('expeditions.creator')
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