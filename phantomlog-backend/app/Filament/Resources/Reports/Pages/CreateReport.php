<?php

declare(strict_types=1);

namespace App\Filament\Resources\Reports\Pages;

use App\Filament\Resources\Reports\ReportResource;
use Filament\Resources\Pages\CreateRecord;
use Override;

final class CreateReport extends CreateRecord
{
    #[Override]
    protected static string $resource = ReportResource::class;
}
