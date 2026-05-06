<?php

declare(strict_types=1);

namespace App\Filament\Resources\InvoiceDetails\Pages;

use App\Filament\Resources\InvoiceDetails\InvoiceDetailResource;
use Filament\Resources\Pages\CreateRecord;
use Override;

final class CreateInvoiceDetail extends CreateRecord
{
    #[Override]
    protected static string $resource = InvoiceDetailResource::class;
}
