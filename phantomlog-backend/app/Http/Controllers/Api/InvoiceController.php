<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Product;
use App\Mail\InvoicePaid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->invoices()->with('details')->latest()->paginate($request->input('per_page', 5))
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'dni'            => 'required|string',
            'first_name'     => 'required|string',
            'last_name'      => 'required|string',
            'address'        => 'required|string',
            'payment_method' => 'required|string|in:credito,debito,bizum',
            'items'          => 'required|array|min:1',
            'items.*.product_id' => 'required|uuid|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($request, $data) {
            $total = 0;
            $details = [];

            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $lineTotal        = $product->price * $item['quantity'];
                $lineTotalWithTax = $lineTotal * (1 + $product->tax / 100);
                $total           += $lineTotalWithTax;

                $details[] = [
                    'product_id'     => $product->id,
                    'sku'            => $product->sku,
                    'title'          => $product->title,
                    'price'          => $product->price,
                    'tax'            => $product->tax,
                    'quantity'       => $item['quantity'],
                    'total'          => $lineTotal,
                    'total_with_tax' => $lineTotalWithTax,
                ];

                $product->decrement('stock', $item['quantity']);
            }

            $invoice = $request->user()->invoices()->create([
                'n_invoice'      => 'INV-' . strtoupper(uniqid()),
                'dni'            => $data['dni'],
                'first_name'     => $data['first_name'],
                'last_name'      => $data['last_name'],
                'address'        => $data['address'],
                'payment_method' => $data['payment_method'],
                'tax'            => 21,
                'total'          => $total,
            ]);

            $invoice->details()->createMany($details);

            try {
                Mail::to($request->user()->email)->send(new InvoicePaid($invoice));
            } catch (\Exception $e) {
                \Log::error("Error enviando email de factura #{$invoice->n_invoice}: " . $e->getMessage());
            }

            return response()->json($invoice->load('details'), 201);
        });
    }

    public function show(Request $request, Invoice $invoice)
    {
        if ($request->user()->id !== $invoice->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json($invoice->load('details.product'));
    }
}