<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Forum;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Forum $forum)
    {
        return response()->json(
            $forum->reports()->with('user')->withCount('comments')->latest()->get()
        );
    }

    public function store(Request $request, Forum $forum)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
        ]);

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
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
        ]);

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