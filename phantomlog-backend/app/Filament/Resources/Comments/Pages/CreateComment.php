<?php

declare(strict_types=1);

namespace App\Filament\Resources\Comments\Pages;

use App\Filament\Resources\Comments\CommentResource;
use Filament\Resources\Pages\CreateRecord;
use Override;

final class CreateComment extends CreateRecord
{
    #[Override]
    protected static string $resource = CommentResource::class;
}
