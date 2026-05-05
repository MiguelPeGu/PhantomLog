<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Forum;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReportController extends Controller
{
    public function index(Request $request, Forum $forum)
    {
        return response()->json(
            $forum->reports()->with('user')->withCount('comments')->latest()->paginate($request->input('per_page', 10))
        );
    }

    public function store(Request $request, Forum $forum)
    {
        $data = $request->validate([
            'title'       => ['required', 'string', 'min:5', 'max:255', 'unique:reports,title', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡]+$/'],
            'description' => 'required|string|max:5000',
            'image'       => ['required', 'string', 'regex:/^data:image\/(jpeg|png|webp|jpg);base64,/'],
        ], [
            'title.required' => 'El título de la evidencia es obligatorio.',
            'title.unique' => 'Ya existe una evidencia registrada con ese título en los archivos.',
            'title.regex' => 'El título contiene símbolos no permitidos.',
            'image.required' => 'Debes adjuntar una captura o evidencia visual.',
            'image.regex' => 'El archivo debe ser una imagen real (JPG, PNG o WEBP).',
        ]);

        // Sanitización manual
        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'image') {
                $data[$key] = trim(strip_tags($value));
            }
        }

        if (!empty($request->image)) {
            if (preg_match('/^data:image\/(\w+);base64,/', $request->image, $type)) {
                $image   = substr($request->image, strpos($request->image, ',') + 1);
                $type    = strtolower($type[1]);
                $image   = base64_decode($image);
                $imgName = Str::random(40) . '.' . $type;

                $storagePath = 'reports/' . $imgName;
                Storage::disk('public')->put($storagePath, $image);

                $data['image'] = $storagePath;
            }
        }

        if ($request->user()->id !== $forum->user_id) {
            return response()->json(['message' => 'Solo el creador del foro puede hacer reportes.'], 403);
        }

        $report = $forum->reports()->create([
            ...$data,
            'user_id' => $request->user()->id,
            'score'   => 0,
        ]);

        return response()->json($report->load('user'), 201);
    }

    public function show(Forum $forum, Report $report)
    {
        return response()->json(
            $report->load(['user', 'comments.user'])
        );
    }

    public function update(Request $request, Forum $forum, Report $report)
    {
        if ($request->user()->id !== $report->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $data = $request->validate([
            'title'       => ['sometimes', 'string', 'min:5', 'max:255', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡]+$/'],
            'description' => 'sometimes|string|max:5000',
            'image'       => ['sometimes', 'string', 'regex:/^data:image\/(jpeg|png|webp|jpg);base64,/'],
        ]);

        // Sanitización manual
        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'image') {
                $data[$key] = trim(strip_tags($value));
            }
        }

        if ($request->has('image') && !empty($request->image)) {
            if (preg_match('/^data:image\/(\w+);base64,/', $request->image, $type)) {
                // Borrar imagen vieja si existe
                if ($report->image) {
                    Storage::disk('public')->delete($report->image);
                }

                $image   = substr($request->image, strpos($request->image, ',') + 1);
                $type    = strtolower($type[1]);
                $image   = base64_decode($image);
                $imgName = Str::random(40) . '.' . $type;

                $storagePath = 'reports/' . $imgName;
                Storage::disk('public')->put($storagePath, $image);

                $data['image'] = $storagePath;
            }
        }

        $report->update($data);

        return response()->json($report);
    }

    public function destroy(Request $request, Forum $forum, Report $report)
    {
        if ($request->user()->id !== $report->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $report->delete();

        return response()->json(null, 204);
    }
}