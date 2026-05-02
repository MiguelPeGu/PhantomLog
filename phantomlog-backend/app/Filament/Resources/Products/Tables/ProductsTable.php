<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use App\Filament\Resources\Products\ProductResource;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->label('Imagen'),
                TextColumn::make('sku')
                    ->label('SKU')
                    ->searchable(),
                TextColumn::make('title')
                    ->label('Nombre')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('price')
                    ->label('Precio')
                    ->money('EUR')
                    ->sortable(),
                TextColumn::make('stock')
                    ->label('Stock')
                    ->numeric()
                    ->badge()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordUrl(fn ($record) => ProductResource::getUrl('view', ['record' => $record]))
            ->recordActions([
                \Filament\Actions\ViewAction::make()->label('Ver'),
                \Filament\Actions\EditAction::make()->label('Editar'),
                \Filament\Actions\DeleteAction::make()->label('Borrar'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
