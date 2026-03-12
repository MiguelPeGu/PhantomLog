<?php

namespace App\Filament\Resources\Forums\Pages;

use App\Filament\Resources\Forums\ForumResource;
use Filament\Resources\Pages\CreateRecord;

class CreateForum extends CreateRecord
{
    protected static string $resource = ForumResource::class;
}
