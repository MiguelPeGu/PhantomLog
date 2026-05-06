<?php

declare(strict_types=1);

namespace App\Filament\Resources\Expeditions\Tables;

use App\Filament\Resources\Expeditions\ExpeditionResource;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

final class ExpeditionsTable
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
            ->recordUrl(fn ($record): string => ExpeditionResource::getUrl('view', ['record' => $record]))
            ->recordActions([
                ViewAction::make()->label('Ver'),
                EditAction::make()->label('Editar'),
                DeleteAction::make()->label('Borrar'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
