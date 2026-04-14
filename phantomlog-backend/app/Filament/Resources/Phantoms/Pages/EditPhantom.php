<?php

namespace App\Filament\Resources\Phantoms\Pages;

use App\Filament\Resources\Phantoms\PhantomResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPhantom extends EditRecord
{
    protected static string $resource = PhantomResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
