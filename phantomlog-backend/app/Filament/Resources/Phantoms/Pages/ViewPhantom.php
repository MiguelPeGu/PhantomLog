<?php

namespace App\Filament\Resources\Phantoms\Pages;

use App\Filament\Resources\Phantoms\PhantomResource;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\ViewRecord;

class ViewPhantom extends ViewRecord
{
    protected static string $resource = PhantomResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
            DeleteAction::make(),
        ];
    }
}
