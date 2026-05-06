<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Report;
use Illuminate\Http\Request;

final class CommentController extends Controller
{
    public function index(Report $report)
    {
        return response()->json(
            $report->comments()->with('user')->latest()->paginate(10)
        );
    }

    public function store(Request $request, Report $report)
    {
        $data = $request->validate([
            'content' => ['required', 'string', 'max:1000', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡.,;:\(\)\"\'\-]+$/'],
        ], [
            'content.required' => 'El comentario no puede estar vacío.',
            'content.max' => 'Has excedido el límite de caracteres (máximo 1000).',
            'content.regex' => 'El comentario contiene símbolos no permitidos.',
        ]);

        $data['content'] = mb_trim(strip_tags((string) $data['content']));

        $comment = $report->comments()->create([
            'content' => $data['content'],
            'user_id' => $request->user()->id,
            'score' => 0,
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function show(Report $report, Comment $comment)
    {
        return response()->json($comment->load('user'));
    }

    public function update(Request $request, Report $report, Comment $comment)
    {
        if ($request->user()->id !== $comment->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $data = $request->validate([
            'content' => ['required', 'string'],
        ]);

        $comment->update($data);

        return response()->json($comment);
    }

    public function destroy(Request $request, Report $report, Comment $comment)
    {
        if ($request->user()->id !== $comment->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $comment->delete();

        return response()->json(null, 204);
    }
}
