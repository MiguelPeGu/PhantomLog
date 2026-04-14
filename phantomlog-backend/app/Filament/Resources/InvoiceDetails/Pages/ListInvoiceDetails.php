<?php

namespace App\Filament\Resources\InvoiceDetails\Pages;

use App\Filament\Resources\InvoiceDetails\InvoiceDetailResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListInvoiceDetails extends ListRecords
{
    protected static string $resource = InvoiceDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
