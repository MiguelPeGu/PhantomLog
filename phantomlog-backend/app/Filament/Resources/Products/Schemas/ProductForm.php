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
                TextInput::make('sku')
                    ->label('SKU')
                    ->required(),
                TextInput::make('title')
                    ->required(),

                Textarea::make('description')
                    ->required()
                    ->rows(3),
                TextInput::make('provider')
                    ->required(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->prefix('$')
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
                FileUpload::make('image')
                    ->image()
                    ->dehydrated(function ($state) {
                        return filled($state);
                    })
                    ->required(fn (string $operation): bool => $operation === 'create'),
            ]);
    }
}
