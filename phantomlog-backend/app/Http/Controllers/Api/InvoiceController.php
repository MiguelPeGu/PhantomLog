<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Mail\InvoicePaid;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

final class InvoiceController
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);
        $query = $user->invoices()->with('details')->latest();

        /** @var int $perPage */
        $perPage = $request->input('per_page', 5);

        return response()->json($query->paginate((int) $perPage));
    }

    public function store(Request $request): JsonResponse
    {
        /** @var array<string, mixed> $data */
        $data = $request->validate([
            'dni' => ['required', 'string', 'regex:/^[0-9]{8}[A-Z]$/i'],
            'first_name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'last_name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'mobile' => ['required', 'string', 'regex:/^[0-9]+$/'],
            'address' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\-\/ºª]+$/'],
            'postal_code' => ['required', 'numeric', 'digits:5'],
            'payment_method' => ['required', 'string', 'in:credito,debito,bizum'],

            // Campos de tarjeta opcionales si es bizum
            'card' => ['required_if:payment_method,credito,debito', 'nullable', 'string', 'regex:/^[0-9\s]{16,19}$/'],
            'expiry' => ['required_if:payment_method,credito,debito', 'nullable', 'string', 'regex:/^[0-9]{2}\/[0-9]{2}$/'],
            'cvv' => ['required_if:payment_method,credito,debito', 'nullable', 'string', 'regex:/^[0-9]{3}$/'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'uuid', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ], [
            'dni.regex' => 'El DNI debe tener 8 números y una letra.',
            'first_name.regex' => 'El nombre no puede contener números ni símbolos.',
            'last_name.regex' => 'Los apellidos no pueden contener números ni símbolos.',
            'mobile.regex' => 'El teléfono debe contener únicamente números.',
            'address.regex' => 'La dirección contiene caracteres no permitidos.',
            'postal_code.numeric' => 'El código postal debe ser únicamente numérico.',
            'card.regex' => 'El número de tarjeta debe tener 16 dígitos.',
            'expiry.regex' => 'La fecha de caducidad debe tener formato MM/AA.',
            'cvv.regex' => 'El CVV debe tener 3 números.',
        ]);

        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = mb_trim(strip_tags($value));
            }
        }

        return DB::transaction(function () use ($request, $data) {
            $total = 0;
            $details = [];

            /** @var array<array{product_id: string, quantity: int}> $items */
            $items = $data['items'];
            foreach ($items as $item) {
                $product = Product::query()->findOrFail($item['product_id']);

                $lineTotal = (float) ($product->price) * (int) ($item['quantity']);
                $lineTotalWithTax = $lineTotal * (1 + (int) ($product->tax) / 100);
                $total += $lineTotalWithTax;

                $details[] = [
                    'product_id' => $product->id,
                    'sku' => $product->sku,
                    'title' => $product->title,
                    'price' => $product->price,
                    'tax' => $product->tax,
                    'quantity' => $item['quantity'],
                    'total' => $lineTotal,
                    'total_with_tax' => $lineTotalWithTax,
                ];

                $product->decrement('stock', $item['quantity']);
            }

            $user = $request->user();
            assert($user instanceof User);

            $invoice = $user->invoices()->create([
                'n_invoice' => 'INV-'.mb_strtoupper(Str::uuid()->toString()),
                'dni' => $data['dni'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'address' => $data['address'],
                'postal_code' => $data['postal_code'],
                'payment_method' => $data['payment_method'],
                'tax' => 21,
                'total' => $total,
            ]);

            $invoice->details()->createMany($details); 

            try {
                Mail::to($user->email)->send(new InvoicePaid($invoice));
            } catch (Exception $exception) {
                Log::error(sprintf('Error enviando email de factura #%s: ', $invoice->n_invoice).$exception->getMessage());
            }

            return response()->json($invoice->load('details'), 201);
        });
    }

    public function show(Request $request, Invoice $invoice): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        if ($user->id !== $invoice->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json($invoice->load('details.product'));
    }
}
