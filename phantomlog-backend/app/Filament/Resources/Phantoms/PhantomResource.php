<?php

namespace App\Filament\Resources\Phantoms;

use App\Filament\Resources\Phantoms\Pages\CreatePhantom;
use App\Filament\Resources\Phantoms\Pages\EditPhantom;
use App\Filament\Resources\Phantoms\Pages\ListPhantoms;
use App\Filament\Resources\Phantoms\Schemas\PhantomForm;
use App\Filament\Resources\Phantoms\Tables\PhantomsTable;
use App\Models\Phantom;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PhantomResource extends Resource
{
    protected static ?string $model = Phantom::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return PhantomForm::configure($schema);
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
            'edit' => EditPhantom::route('/{record}/edit'),
        ];
    }
}
