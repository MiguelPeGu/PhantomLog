<?php

namespace App\Filament\Resources\Forums\Pages;

use App\Filament\Resources\Forums\ForumResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListForums extends ListRecords
{
    protected static string $resource = ForumResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
