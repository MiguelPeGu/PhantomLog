<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
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
            'content' => 'required|string',
        ]);

        $comment = $report->comments()->create([
            'content' => $data['content'],
            'user_id' => $request->user()->id,
            'score'   => 0,
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
            'content' => 'required|string',
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