<?php

namespace App\Filament\Resources\InvoiceDetails\Pages;

use App\Filament\Resources\InvoiceDetails\InvoiceDetailResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditInvoiceDetail extends EditRecord
{
    protected static string $resource = InvoiceDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
