<?php

declare(strict_types=1);

namespace App\Filament\Resources\Phantoms\Pages;

use App\Filament\Resources\Phantoms\PhantomResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Override;

final class ListPhantoms extends ListRecords
{
    #[Override]
    protected static string $resource = PhantomResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->label('Nuevo Fantasma'),
        ];
    }
}
