<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Forum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class ForumController extends Controller
{
    public function index(Request $request)
    {
        // select() optimiza la query excluyendo campos no usados en tarjetas
        // description SÍ se necesita para el preview de 120 chars en cada card
        $query = Forum::query()->select('id', 'title', 'description', 'image', 'user_id', 'created_at', 'updated_at')
            ->with('user:id,username,img')
            ->withCount('reports')
            ->withAvg('reports', 'score');

        if ($request->has('search') && ! empty($request->search)) {
            $term = $request->search;
            $query->where('title', 'like', '%'.$term.'%')
                ->orWhere('description', 'like', '%'.$term.'%');
        }

        return response()->json(
            $query->latest()->paginate($request->input('per_page', 9))
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'min:10', 'max:100', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡]+$/'],
            'description' => ['required', 'string', 'min:20', 'max:2000'],
            'image' => ['required', 'string', 'regex:/^data:image\/(jpeg|png|webp|jpg);base64,/'],
        ], [
            'title.required' => 'El título es obligatorio para el archivo.',
            'title.min' => 'El título debe tener al menos 10 caracteres para ser descriptivo.',
            'title.max' => 'El título es demasiado extenso (máximo 100 caracteres).',
            'title.regex' => 'El título contiene caracteres especiales no permitidos (solo letras, números y signos básicos).',
            'description.required' => 'La descripción de los hechos es obligatoria.',
            'description.min' => 'La descripción es muy corta (mínimo 20 caracteres).',
            'description.max' => 'Has excedido el límite de almacenamiento (máximo 2000 caracteres).',
            'image.required' => 'Es obligatorio adjuntar una evidencia visual.',
            'image.regex' => 'El archivo debe ser una imagen válida (JPG, PNG o WEBP).',
        ]);

        // Sanitización manual
        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'image') {
                $data[$key] = mb_trim(strip_tags($value));
            }
        }

        if (preg_match('/^data:image\/(\w+);base64,/', $request->image, $type)) {
            $image = mb_substr($request->image, mb_strpos($request->image, ',') + 1);
            $type = mb_strtolower($type[1]); // jpg, png, etc.
            $image = base64_decode($image);
            $imgName = Str::random(40).'.'.$type;

            $storagePath = 'forums/'.$imgName;
            Storage::disk('public')->put($storagePath, $image);

            $data['image'] = $storagePath;
        } else {
            return response()->json(['message' => 'Invalid image format.'], 422);
        }

        $forum = $request->user()->forums()->create($data);

        return response()->json($forum->load('user'), 201);
    }

    public function show(Forum $forum)
    {
        $forum->load(['user', 'reports.user', 'reports' => fn ($q) => $q->withCount('comments')])
            ->loadAvg('reports', 'score');

        // Exponer credibility_score con el mismo nombre esperado por el frontend
        $forum->credibility_score = (float) ($forum->reports_avg_score ?? 0);

        return response()->json($forum);
    }

    public function update(Request $request, Forum $forum)
    {
        if ($request->user()->id !== $forum->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'min:10', 'max:100', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡]+$/'],
            'description' => ['sometimes', 'string', 'min:20', 'max:2000'],
            'image' => ['sometimes', 'string', 'regex:/^data:image\/(jpeg|png|webp|jpg);base64,/'],
        ]);

        // Sanitización manual
        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'image') {
                $data[$key] = mb_trim(strip_tags($value));
            }
        }

        if ($request->has('image') && ! empty($request->image) && preg_match('/^data:image\/(\w+);base64,/', (string) $request->image, $type)) {
            // Borrar imagen vieja si existe
            if ($forum->image) {
                Storage::disk('public')->delete($forum->image);
            }
            $image = mb_substr((string) $request->image, mb_strpos((string) $request->image, ',') + 1);
            $type = mb_strtolower($type[1]);
            $image = base64_decode($image);
            $imgName = Str::random(40).'.'.$type;
            $storagePath = 'forums/'.$imgName;
            Storage::disk('public')->put($storagePath, $image);
            $data['image'] = $storagePath;
        }

        $forum->update($data);

        return response()->json($forum);
    }

    public function destroy(Request $request, Forum $forum)
    {
        if ($request->user()->id !== $forum->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $forum->delete();

        return response()->json(null, 204);
    }

    // Seguir / dejar de seguir un foro
    public function toggleFollow(Request $request, Forum $forum)
    {
        $request->user()->followedForums()->toggle($forum->id);

        return response()->json(['message' => 'Ok']);
    }
}
