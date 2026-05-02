<?php

declare(strict_types=1);

use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\User;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('invoice has all required fields filled', function () {
    $invoice = Invoice::factory()->create();

    expect($invoice->id)->not->toBeNull()
        ->and($invoice->number)->not->toBeNull()
        ->and($invoice->user_id)->not->toBeNull()
        ->and($invoice->total)->not->toBeNull();
});

test('invoice detail has all required fields filled', function () {
    $detail = InvoiceDetail::factory()->create();

    expect($detail->id)->not->toBeNull()
        ->and($detail->invoice_id)->not->toBeNull()
        ->and($detail->product_id)->not->toBeNull()
        ->and($detail->quantity)->toBeGreaterThan(0)
        ->and($detail->price)->not->toBeNull()
        ->and($detail->sku)->not->toBeNull();
});

test('invoice has many details', function () {
    $invoice = Invoice::factory()->has(InvoiceDetail::factory()->count(3), 'details')->create();

    expect($invoice->details)->toHaveCount(3)
        ->and($invoice->details->first())->toBeInstanceOf(InvoiceDetail::class);
});
