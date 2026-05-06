<?php

declare(strict_types=1);

namespace App\Filament\Resources\InvoiceDetails\Pages;

use App\Filament\Resources\InvoiceDetails\InvoiceDetailResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Override;

final class EditInvoiceDetail extends EditRecord
{
    #[Override]
    protected static string $resource = InvoiceDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
