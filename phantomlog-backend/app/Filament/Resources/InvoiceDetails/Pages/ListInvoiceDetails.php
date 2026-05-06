<?php

declare(strict_types=1);

namespace App\Filament\Resources\InvoiceDetails\Pages;

use App\Filament\Resources\InvoiceDetails\InvoiceDetailResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Override;

final class ListInvoiceDetails extends ListRecords
{
    #[Override]
    protected static string $resource = InvoiceDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
