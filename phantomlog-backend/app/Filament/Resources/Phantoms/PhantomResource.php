<?php

declare(strict_types=1);

namespace App\Filament\Resources\Phantoms;

use App\Filament\Resources\Phantoms\Pages\CreatePhantom;
use App\Filament\Resources\Phantoms\Pages\EditPhantom;
use App\Filament\Resources\Phantoms\Pages\ListPhantoms;
use App\Filament\Resources\Phantoms\Pages\ViewPhantom;
use App\Filament\Resources\Phantoms\Schemas\PhantomForm;
use App\Filament\Resources\Phantoms\Schemas\PhantomInfolist;
use App\Filament\Resources\Phantoms\Tables\PhantomsTable;
use App\Models\Phantom;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Override;
use UnitEnum;

final class PhantomResource extends Resource
{
    #[Override]
    protected static ?string $model = Phantom::class;

    #[Override]
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSparkles;

    #[Override]
    protected static string|UnitEnum|null $navigationGroup = 'Operaciones de Campo';

    #[Override]
    protected static ?string $recordTitleAttribute = 'name';

    #[Override]
    protected static ?string $modelLabel = 'Fantasma';

    #[Override]
    protected static ?string $pluralModelLabel = 'Fantasmas';

    public static function getNavigationBadge(): ?string
    {
        return (string) Phantom::query()->count();
    }

    public static function form(Schema $schema): Schema
    {
        return PhantomForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return PhantomInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PhantomsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPhantoms::route('/'),
            'create' => CreatePhantom::route('/create'),
            'view' => ViewPhantom::route('/{record}'),
            'edit' => EditPhantom::route('/{record}/edit'),
        ];
    }
}
