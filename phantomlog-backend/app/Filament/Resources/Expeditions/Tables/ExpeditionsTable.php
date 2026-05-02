<?php

namespace App\Filament\Resources\Expeditions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use App\Filament\Resources\Expeditions\ExpeditionResource;
use Filament\Tables\Table;

class ExpeditionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Expedición')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('location')
                    ->label('Ubicación')
                    ->searchable(),
                TextColumn::make('date')
                    ->label('Fecha')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
                TextColumn::make('phantom.name')
                    ->label('Objetivo'),
                TextColumn::make('user.username')
                    ->label('Líder'),
            ])
            ->filters([
                //
            ])
            ->recordUrl(fn ($record) => ExpeditionResource::getUrl('view', ['record' => $record]))
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
