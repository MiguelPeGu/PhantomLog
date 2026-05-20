<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\Forum;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class ForumController
{
    public function index(Request $request): JsonResponse
    {
        $query = Forum::query()
            ->select('id', 'title', 'description', 'image', 'user_id', 'created_at', 'updated_at')
            ->with('user:id,username,img')
            ->withCount('reports')
            ->withAvg('reports', 'score')
            ->when(
                $request->filled('search'),
                fn (Builder $query): Builder => $query
                    ->where('title', 'like', '%'.$request->string('search').'%')
                    ->orWhere('description', 'like', '%'.$request->string('search').'%')
            )
            ->orderByDesc(
                Report::query()->selectRaw('COALESCE(SUM(score), 0)')
                    ->whereColumn('forum_id', 'forums.id')
            )
            ->orderByDesc('forums.created_at');

        return response()->json(
            $query->paginate($request->integer('per_page', 9))
        );
    }

    public function store(Request $request): JsonResponse
    {
        /** @var array<string, mixed> $data */
        $data = $request->validate([
            'title' => ['required', 'string', 'min:3', 'max:100'],
            'description' => ['required', 'string', 'min:3', 'max:2000'],
            'image' => ['nullable', 'string', 'regex:/^data:image\/(jpeg|png|webp|jpg);base64,/'],
        ]);

        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'image') {
                $data[$key] = mb_trim(strip_tags($value));
            }
        }

        $requestImage = $request->string('image')->toString();
        if ($requestImage !== '') {
            if (preg_match('/^data:image\/(\w+);base64,/', $requestImage, $type)) {
                $image = mb_substr($requestImage, mb_strpos($requestImage, ',') + 1);
                $type = mb_strtolower($type[1]);
                $image = base64_decode($image);
                $imgName = Str::random(40).'.'.$type;
                $storagePath = 'forums/'.$imgName;
                Storage::disk('public')->put($storagePath, $image);
                $data['image'] = $storagePath;
            } else {
                return response()->json(['message' => 'Invalid image format.'], 422);
            }
        }

        $user = $request->user();
        assert($user instanceof User);
        $forum = $user->forums()->create($data);

        return response()->json($forum->load('user'), 201);
    }

    public function show(Forum $forum): JsonResponse
    {
        $forum->load('user')->loadAvg('reports', 'score');

        return response()->json($forum);
    }

    public function update(Request $request, Forum $forum): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        if ($user->id !== $forum->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        /** @var array<string, mixed> $data */
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'min:10', 'max:100', 'regex:/^[a-zA-Z0-9\s?!]+$/'],
            'description' => ['sometimes', 'string', 'min:20', 'max:2000'],
            'image' => ['sometimes', 'string', 'regex:/^data:image\/(jpeg|png|webp|jpg);base64,/'],
        ]);

        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'image') {
                $data[$key] = mb_trim(strip_tags($value));
            }
        }

        if ($request->has('image') && ! empty($request->image)) {
            $requestImage = $request->string('image')->toString();
            if (preg_match('/^data:image\/(\w+);base64,/', $requestImage, $type)) {
                if ($forum->image) {
                    Storage::disk('public')->delete($forum->image);
                }

                $image = mb_substr($requestImage, mb_strpos($requestImage, ',') + 1);
                $type = mb_strtolower($type[1]);
                $image = base64_decode($image);
                $imgName = Str::random(40).'.'.$type;
                $storagePath = 'forums/'.$imgName;
                Storage::disk('public')->put($storagePath, $image);
                $data['image'] = $storagePath;
            }
        }

        $forum->update($data);

        return response()->json($forum);
    }

    public function destroy(Request $request, Forum $forum): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        if ($user->id !== $forum->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $forum->delete();

        return response()->json(null, 204);
    }
    /*
    public function toggleFollow(Request $request, Forum $forum): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        $user->followedForums()->toggle($forum->id);

        return response()->json(['message' => 'Ok']);
    }*/
}
