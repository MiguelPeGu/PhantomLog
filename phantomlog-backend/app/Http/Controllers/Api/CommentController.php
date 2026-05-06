<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\Comment;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class CommentController
{
    public function index(Report $report): JsonResponse
    {
        return response()->json(
            $report->comments()->with('user')->latest()->paginate(10)
        );
    }

    public function store(Request $request, Report $report): JsonResponse
    {
        /** @var array{content: string} $data */
        $data = $request->validate([
            'content' => ['required', 'string', 'max:1000', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡.,;:\(\)\"\'\-]+$/'],
        ], [
            'content.required' => 'El comentario no puede estar vacío.',
            'content.max' => 'Has excedido el límite de caracteres (máximo 1000).',
            'content.regex' => 'El comentario contiene símbolos no permitidos.',
        ]);

        $data['content'] = mb_trim(strip_tags((string) ($data['content'])));

        $user = $request->user();
        assert($user instanceof User);

        $comment = $report->comments()->create([
            'content' => $data['content'],
            'user_id' => $user->id,
            'forum_id' => $report->forum_id,
            'score' => 0,
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function show(Report $report, Comment $comment): JsonResponse
    {
        return response()->json($comment->load('user'));
    }

    public function update(Request $request, Report $report, Comment $comment): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        if ($user->id !== $comment->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        /** @var array<string, mixed> $data */
        $data = $request->validate([
            'content' => ['required', 'string'],
        ]);

        $comment->update($data);

        return response()->json($comment);
    }

    public function destroy(Request $request, Report $report, Comment $comment): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        if ($user->id !== $comment->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $comment->delete();

        return response()->json(null, 204);
    }
}
