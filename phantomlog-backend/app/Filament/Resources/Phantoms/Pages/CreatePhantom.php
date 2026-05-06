<?php

declare(strict_types=1);

namespace App\Filament\Resources\Phantoms\Pages;

use App\Filament\Resources\Phantoms\PhantomResource;
use Filament\Resources\Pages\CreateRecord;
use Override;

final class CreatePhantom extends CreateRecord
{
    #[Override]
    protected static string $resource = PhantomResource::class;
}
