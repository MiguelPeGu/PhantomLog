<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Schema;

class ProductInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Detalles del Producto')
                    ->tabs([
                        Tabs\Tab::make('General')
                            ->icon('heroicon-o-shopping-bag')
                            ->schema([
                                Section::make('Información del Producto')
                                    ->schema([
                                        TextEntry::make('title')->label('Nombre')->weight('bold'),
                                        TextEntry::make('sku')->label('SKU')->copyable(),
                                        TextEntry::make('category')->label('Categoría')->badge()->color('gray'),
                                        TextEntry::make('provider')->label('Proveedor'),
                                        TextEntry::make('description')->label('Descripción')->columnSpanFull(),
                                    ])->columns(2),
                            ]),
                        Tabs\Tab::make('Precio y Stock')
                            ->icon('heroicon-o-currency-euro')
                            ->schema([
                                Section::make('Valores')
                                    ->schema([
                                        TextEntry::make('price')->label('Precio')->money('EUR'),
                                        TextEntry::make('tax')->label('IVA')->suffix('%'),
                                        TextEntry::make('stock')->label('Stock Disponible')->badge(),
                                    ])->columns(3),
                            ]),
                        Tabs\Tab::make('Multimedia')
                            ->icon('heroicon-o-photo')
                            ->schema([
                                Section::make('Imagen del Producto')
                                    ->schema([
                                        ImageEntry::make('image')->label(false)->width(200),
                                    ]),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }
}
