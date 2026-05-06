<?php

declare(strict_types=1);

namespace App\Filament\Resources\Expeditions\Pages;

use App\Filament\Resources\Expeditions\ExpeditionResource;
use Filament\Resources\Pages\CreateRecord;
use Override;

final class CreateExpedition extends CreateRecord
{
    #[Override]
    protected static string $resource = ExpeditionResource::class;
}
