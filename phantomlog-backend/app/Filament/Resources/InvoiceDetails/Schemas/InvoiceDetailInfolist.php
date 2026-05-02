<?php

namespace App\Filament\Resources\InvoiceDetails\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class InvoiceDetailInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Detalle de Línea')
                    ->schema([
                        TextEntry::make('sku')->label('SKU'),
                        TextEntry::make('title')->label('Producto'),
                        TextEntry::make('price')->label('Precio Unitario')->money('EUR'),
                        TextEntry::make('quantity')->label('Cantidad'),
                        TextEntry::make('tax')->label('IVA')->suffix('%'),
                        TextEntry::make('total_with_tax')->label('Total Línea')->money('EUR')->weight('bold'),
                    ])->columns(2),
            ]);
    }
}
