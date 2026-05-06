<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\Expedition;
use App\Models\Forum;
use App\Models\Phantom;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * BootstrapController
 *
 * Devuelve TODOS los datos iniciales de la app en UNA sola petición HTTP.
 *
 * Sin esto, el DataProvider hacía 5 peticiones paralelas al arrancar:
 *   GET /forums + /expeditions + /phantoms + /products + /invoices
 *
 * Con SQLite (base de datos single-file), las 5 peticiones se serializan
 * internamente aunque el frontend las lance con Promise.all, ya que SQLite
 * solo permite un escritor/lector a la vez. Esto causaba 8-10 segundos
 * de carga al arrancar la aplicación.
 *
 * Con este endpoint: 1 única petición → 1 token validation → 1 DB context.
 */
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

        // Foros: paginado página 1
        $forums = Forum::query()->select('id', 'title', 'description', 'image', 'user_id', 'created_at', 'updated_at')
            ->with('user:id,username,img')
            ->withCount('reports')
            ->withAvg('reports', 'score')
            ->latest()
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
