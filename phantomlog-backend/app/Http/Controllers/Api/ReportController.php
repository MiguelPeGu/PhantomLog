<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Forum;
use App\Models\Report;
use Illuminate\Http\Request;

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
            'title'       => 'required|string|max:255|unique:reports,title',
            'description' => 'required|string',
            'image'       => 'nullable|string',
        ], [
            'title.unique' => 'Ya existe una evidencia registrada con ese título en los archivos.'
        ]);

        if (!empty($request->image)) {
            if (preg_match('/^data:image\/(\w+);base64,/', $request->image, $type)) {
                $image   = substr($request->image, strpos($request->image, ',') + 1);
                $type    = strtolower($type[1]);
                $image   = base64_decode($image);
                $imgName = \Illuminate\Support\Str::random(40) . '.' . $type;
                
                $path = public_path('images/reports');
                if (!file_exists($path)) {
                    mkdir($path, 0755, true);
                }
                file_put_contents($path . '/' . $imgName, $image);
                
                $data['image'] = 'images/reports/' . $imgName;
            } else {
                return response()->json(['message' => 'Invalid image format.'], 422);
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