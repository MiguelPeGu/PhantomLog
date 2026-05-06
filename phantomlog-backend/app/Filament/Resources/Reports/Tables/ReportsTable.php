<?php

declare(strict_types=1);

namespace App\Filament\Resources\Reports\Tables;

use App\Filament\Resources\Reports\ReportResource;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

final class ReportsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('forum.title')
                    ->label('Foro')
                    ->searchable(),
                TextColumn::make('user.username')
                    ->label('Autor')
                    ->searchable(),
                TextColumn::make('title')
                    ->label('Título')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('score')
                    ->label('Puntuación')
                    ->badge()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->label('Fecha')
                    ->dateTime('d/m/Y')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordUrl(fn ($record): string => ReportResource::getUrl('view', ['record' => $record]))
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
