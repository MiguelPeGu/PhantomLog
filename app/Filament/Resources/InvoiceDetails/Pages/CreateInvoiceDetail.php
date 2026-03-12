<?php

namespace App\Filament\Resources\InvoiceDetails\Pages;

use App\Filament\Resources\InvoiceDetails\InvoiceDetailResource;
use Filament\Resources\Pages\CreateRecord;

class CreateInvoiceDetail extends CreateRecord
{
    protected static string $resource = InvoiceDetailResource::class;
}
