<?php

namespace App\Filament\Resources\Phantoms\Pages;

use App\Filament\Resources\Phantoms\PhantomResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPhantoms extends ListRecords
{
    protected static string $resource = PhantomResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
