<?php

namespace App\Filament\Resources\InvoiceDetails;

use App\Filament\Resources\InvoiceDetails\Pages\CreateInvoiceDetail;
use App\Filament\Resources\InvoiceDetails\Pages\EditInvoiceDetail;
use App\Filament\Resources\InvoiceDetails\Pages\ListInvoiceDetails;
use App\Filament\Resources\InvoiceDetails\Schemas\InvoiceDetailForm;
use App\Filament\Resources\InvoiceDetails\Tables\InvoiceDetailsTable;
use App\Models\InvoiceDetail;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class InvoiceDetailResource extends Resource
{
    protected static ?string $model = InvoiceDetail::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'id';

    public static function form(Schema $schema): Schema
    {
        return InvoiceDetailForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return InvoiceDetailsTable::configure($table);
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
            'index' => ListInvoiceDetails::route('/'),
            'create' => CreateInvoiceDetail::route('/create'),
            'edit' => EditInvoiceDetail::route('/{record}/edit'),
        ];
    }
}
