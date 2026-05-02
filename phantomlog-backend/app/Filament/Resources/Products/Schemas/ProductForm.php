<?php

declare(strict_types=1);

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

final class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Section::make('Detalles del Producto')
                    ->schema([
                        TextInput::make('sku')
                            ->label('SKU')
                            ->required(),
                        TextInput::make('title')
                            ->required(),
                        \Filament\Forms\Components\Select::make('category')
                            ->options([
                                'EQUIPMENT' => 'EQUIPAMIENTO',
                                'PROTECTION' => 'PROTECCIÓN',
                                'CONSUMABLE' => 'CONSUMIBLE',
                                'CURSED' => 'OBJETO MALDITO',
                            ])
                            ->required(),
                        Textarea::make('description')
                            ->required()
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),

                \Filament\Schemas\Components\Section::make('Precios e Inventario')
                    ->schema([
                        TextInput::make('price')
                            ->required()
                            ->numeric()
                            ->default(0)
                            ->prefix('€')
                            ->live(),
                        TextInput::make('tax')
                            ->required()
                            ->numeric()
                            ->default(21)
                            ->suffix('%'),
                        TextInput::make('stock')
                            ->required()
                            ->numeric()
                            ->default(0),
                        TextInput::make('provider')
                            ->required(),
                    ])->columns(2),

                \Filament\Schemas\Components\Section::make('Multimedia')
                    ->schema([
                        FileUpload::make('image')
                            ->image()
                            ->disk('public')
                            ->directory('images')
                            ->visibility('public')
                            ->dehydrated(function ($state) {
                                return filled($state);
                            })
                            ->required(fn (string $operation): bool => $operation === 'create'),
                    ]),
            ]);
    }
}
