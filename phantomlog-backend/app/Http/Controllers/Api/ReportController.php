<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\Forum;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class ReportController
{
    public function index(Request $request, Forum $forum): JsonResponse
    {
        $perPage = $request->integer('per_page', 10);

        return response()->json(
            $forum->reports()->with('user')->withCount('comments')->latest()->paginate($perPage)
        );
    }

    public function store(Request $request, Forum $forum): JsonResponse
    {
        /** @var array<string, mixed> $data */
        $data = $request->validate([
            'title' => ['required', 'string', 'min:5', 'max:255', 'unique:reports,title', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡]+$/'],
            'description' => ['required', 'string', 'max:5000'],
            'image' => ['required', 'string', 'regex:/^data:image\/(jpeg|png|webp|jpg);base64,/'],
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
                $data[$key] = mb_trim(strip_tags($value));
            }
        }

        $requestImage = $request->string('image')->toString();
        if ($requestImage !== '' && $requestImage !== '0' && preg_match('/^data:image\/(\w+);base64,/', $requestImage, $type)) {
            $image = mb_substr($requestImage, mb_strpos($requestImage, ',') + 1);
            $type = mb_strtolower($type[1]);
            $image = base64_decode($image);
            $imgName = Str::random(40).'.'.$type;
            $storagePath = 'reports/'.$imgName;
            Storage::disk('public')->put($storagePath, $image);
            $data['image'] = $storagePath;
        }

        $user = $request->user();
        assert($user instanceof User);

        if ($user->id !== $forum->user_id) {
            return response()->json(['message' => 'Solo el creador del foro puede hacer reportes.'], 403);
        }

        $report = $forum->reports()->create([
            ...$data,
            'user_id' => $user->id,
            'score' => 0,
        ]);

        return response()->json($report->load('user'), 201);
    }

    public function show(Forum $forum, Report $report): JsonResponse
    {
        return response()->json(
            $report->load(['user', 'comments.user'])
        );
    }

    public function update(Request $request, Forum $forum, Report $report): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        if ($user->id !== $report->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        /** @var array<string, mixed> $data */
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'min:5', 'max:255', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡]+$/'],
            'description' => ['sometimes', 'string', 'max:5000'],
            'image' => ['sometimes', 'string', 'regex:/^data:image\/(jpeg|png|webp|jpg);base64,/'],
        ]);

        // Sanitización manual
        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'image') {
                $data[$key] = mb_trim(strip_tags($value));
            }
        }

        if ($request->has('image') && ! empty($request->image)) {
            $requestImage = $request->string('image')->toString(); // fixed: línea 107 (cast + @var eliminado)
            if (preg_match('/^data:image\/(\w+);base64,/', $requestImage, $type)) {
                if ($report->image) {
                    Storage::disk('public')->delete($report->image);
                }

                $image = mb_substr($requestImage, mb_strpos($requestImage, ',') + 1);
                $type = mb_strtolower($type[1]);
                $image = base64_decode($image);
                $imgName = Str::random(40).'.'.$type;
                $storagePath = 'reports/'.$imgName;
                Storage::disk('public')->put($storagePath, $image);
                $data['image'] = $storagePath;
            }
        }

        $report->update($data);

        return response()->json($report);
    }

    public function destroy(Request $request, Forum $forum, Report $report): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        if ($user->id !== $report->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $report->delete();

        return response()->json(null, 204);
    }
}
