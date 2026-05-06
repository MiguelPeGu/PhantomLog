<?php

declare(strict_types=1);

namespace App\Filament\Resources\Forums\Pages;

use App\Filament\Resources\Forums\ForumResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Override;

final class ListForums extends ListRecords
{
    #[Override]
    protected static string $resource = ForumResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
