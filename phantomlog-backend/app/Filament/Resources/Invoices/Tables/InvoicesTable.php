<?php

namespace App\Filament\Resources\Invoices\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use App\Filament\Resources\Invoices\InvoiceResource;
use Filament\Tables\Table;

class InvoicesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('n_invoice')
                    ->label('Nº Factura')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('user.username')
                    ->label('Cliente')
                    ->searchable(),
                TextColumn::make('total')
                    ->label('Total')
                    ->money('EUR')
                    ->sortable(),
                TextColumn::make('payment_method')
                    ->label('Método')
                    ->badge(),
                TextColumn::make('created_at')
                    ->label('Fecha')
                    ->dateTime('d/m/Y')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordUrl(fn ($record) => InvoiceResource::getUrl('view', ['record' => $record]))
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
