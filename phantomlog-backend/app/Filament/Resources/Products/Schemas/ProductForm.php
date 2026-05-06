<?php

declare(strict_types=1);

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

final class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Detalles del Suministro')
                    ->schema([
                        TextInput::make('sku')
                            ->label('Código de Identificación (SKU)')
                            ->required()
                            ->unique(ignoreRecord: true),
                        TextInput::make('title')
                            ->label('Nombre del Objeto')
                            ->required()
                            ->maxLength(100),
                        Select::make('category')
                            ->label('Categoría de Reliquia')
                            ->options([
                                'EQUIPMENT' => 'EQUIPAMIENTO',
                                'PROTECTION' => 'PROTECCIÓN',
                                'CONSUMABLE' => 'CONSUMIBLE',
                                'CURSED' => 'OBJETO MALDITO',
                            ])
                            ->required(),
                        Textarea::make('description')
                            ->label('Propiedades Arcanas')
                            ->required()
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),

                Section::make('Costes e Inventario')
                    ->schema([
                        TextInput::make('price')
                            ->label('Precio de Adquisición')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0)
                            ->prefix('€')
                            ->live(),
                        TextInput::make('tax')
                            ->label('Tasa de Transferencia (IVA)')
                            ->required()
                            ->numeric()
                            ->default(21)
                            ->suffix('%'),
                        TextInput::make('stock')
                            ->label('Unidades en Archivo')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0),
                        TextInput::make('provider')
                            ->label('Proveedor de Origen')
                            ->required(),
                    ])->columns(2),

                Section::make('Multimedia')
                    ->schema([
                        FileUpload::make('image')
                            ->image()
                            ->disk('public')
                            ->directory('images')
                            ->visibility('public')
                            ->dehydrated(fn (mixed $state): bool => filled($state))
                            ->required(fn (string $operation): bool => $operation === 'create'),
                    ]),
            ]);
    }
}
