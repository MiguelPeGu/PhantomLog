<?php

declare(strict_types=1);

namespace App\Filament\Resources\Phantoms\Pages;

use App\Filament\Resources\Phantoms\PhantomResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Override;

final class EditPhantom extends EditRecord
{
    #[Override]
    protected static string $resource = PhantomResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
