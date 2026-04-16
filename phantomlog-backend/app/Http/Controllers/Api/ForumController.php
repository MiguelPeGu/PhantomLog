<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Forum;
use Illuminate\Http\Request;

class ForumController extends Controller
{
    public function index(Request $request)
    {
        $query = Forum::with('user')->withCount('reports');

        if ($request->has('search') && !empty($request->search)) {
            $term = $request->search;
            $query->where('title', 'like', '%' . $term . '%')
                  ->orWhere('description', 'like', '%' . $term . '%');
        }

        return response()->json(
            $query->latest()->paginate($request->input('per_page', 9))
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'image'       => 'required|string',
        ]);

        if (preg_match('/^data:image\/(\w+);base64,/', $request->image, $type)) {
            $image   = substr($request->image, strpos($request->image, ',') + 1);
            $type    = strtolower($type[1]); // jpg, png, etc.
            $image   = base64_decode($image);
            $imgName = \Illuminate\Support\Str::random(40) . '.' . $type;
            
            $path = public_path('images/forums');
            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }
            file_put_contents($path . '/' . $imgName, $image);
            
            $data['image'] = 'images/forums/' . $imgName;
        } else {
            return response()->json(['message' => 'Invalid image format.'], 422);
        }

        $forum = $request->user()->forums()->create($data);

        return response()->json($forum->load('user'), 201);
    }

    public function show(Forum $forum)
    {
        return response()->json(
            $forum->load(['user', 'reports.user', 'reports' => fn($q) => $q->withCount('comments')])
        );
    }

    public function update(Request $request, Forum $forum)
    {
        if ($request->user()->id !== $forum->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $data = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
        ]);

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