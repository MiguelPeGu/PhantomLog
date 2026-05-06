<?php

declare(strict_types=1);

namespace App\Filament\Resources\Comments\Tables;

use App\Filament\Resources\Comments\CommentResource;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

final class CommentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.username')
                    ->label('Autor')
                    ->searchable(),
                TextColumn::make('report.title')
                    ->label('Reporte')
                    ->searchable()
                    ->limit(30),
                TextColumn::make('content')
                    ->label('Comentario')
                    ->limit(50)
                    ->searchable(),
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
            ->recordUrl(fn ($record): string => CommentResource::getUrl('view', ['record' => $record]))
            ->recordActions([
                ViewAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
