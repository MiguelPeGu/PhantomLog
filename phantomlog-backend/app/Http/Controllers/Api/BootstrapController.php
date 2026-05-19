<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\Expedition;
use App\Models\Forum;
use App\Models\Phantom;
use App\Models\Product;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class BootstrapController
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        // Phantoms
        $phantoms = Phantom::query()->select('id', 'name', 'type', 'evidence', 'location')
            ->withCount('expeditions')
            ->latest()
            ->get();

        // Foros: paginado página 1, ordenado por score (igual que ForumController::index)
        $forums = Forum::query()->select('id', 'title', 'description', 'image', 'user_id', 'created_at', 'updated_at')
            ->with('user:id,username,img')
            ->withCount('reports')
            ->withAvg('reports', 'score')
            ->orderByDesc(
                Report::query()->selectRaw('COALESCE(SUM(score), 0)')
                    ->whereColumn('forum_id', 'forums.id')
            )
            ->orderByDesc('forums.created_at')
            ->paginate(9);

        // Expediciones: paginado página 1
        $expeditions = Expedition::query()->select('id', 'user_id', 'phantom_id', 'name', 'location', 'date', 'created_at')
            ->with(['creator:id,username,img', 'phantom:id,name,type'])
            ->withCount('participants')
            ->latest()
            ->paginate(9);

        // Productos: paginado página 1
        $products = Product::query()->select('id', 'title', 'price', 'stock', 'category', 'image', 'created_at')
            ->withCount('invoiceDetails')
            ->latest()
            ->paginate(9);

        // Facturas: solo las del usuario autenticado
        $invoices = $user->invoices()
            ->with('details')
            ->latest()
            ->paginate(5);

        return response()->json([
            'phantoms' => $phantoms,
            'forums' => $forums,
            'expeditions' => $expeditions,
            'products' => $products,
            'invoices' => $invoices,
        ]);
    }
}
