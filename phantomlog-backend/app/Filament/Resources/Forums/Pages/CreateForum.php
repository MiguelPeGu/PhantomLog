<?php

declare(strict_types=1);

namespace App\Filament\Resources\Forums\Pages;

use App\Filament\Resources\Forums\ForumResource;
use Filament\Resources\Pages\CreateRecord;
use Override;

final class CreateForum extends CreateRecord
{
    #[Override]
    protected static string $resource = ForumResource::class;
}
