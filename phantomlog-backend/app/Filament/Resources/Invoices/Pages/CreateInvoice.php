<?php

declare(strict_types=1);

namespace App\Filament\Resources\Invoices\Pages;

use App\Filament\Resources\Invoices\InvoiceResource;
use Filament\Resources\Pages\CreateRecord;
use Override;

final class CreateInvoice extends CreateRecord
{
    #[Override]
    protected static string $resource = InvoiceResource::class;
}
