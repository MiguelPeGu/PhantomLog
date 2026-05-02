<?php

namespace App\Filament\Resources\InvoiceDetails\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class InvoiceDetailsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sku')
                    ->label('SKU')
                    ->searchable(),
                TextColumn::make('title')
                    ->label('Producto')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('price')
                    ->label('Precio/Ud')
                    ->money('EUR')
                    ->sortable(),
                TextColumn::make('quantity')
                    ->label('Cant.')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('total_with_tax')
                    ->label('Total Línea')
                    ->money('EUR')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
