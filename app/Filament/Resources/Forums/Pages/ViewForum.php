<?php

namespace App\Filament\Resources\Forums\Pages;

use App\Filament\Resources\Forums\ForumResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewForum extends ViewRecord
{
    protected static string $resource = ForumResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
