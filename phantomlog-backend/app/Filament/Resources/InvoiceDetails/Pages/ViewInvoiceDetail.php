<?php

declare(strict_types=1);

namespace App\Filament\Resources\InvoiceDetails\Pages;

use App\Filament\Resources\InvoiceDetails\InvoiceDetailResource;
use Filament\Resources\Pages\ViewRecord;
use Override;

final class ViewInvoiceDetail extends ViewRecord
{
    #[Override]
    protected static string $resource = InvoiceDetailResource::class;
}
