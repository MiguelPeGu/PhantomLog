<?php

namespace App\Filament\Resources\Comments\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\ViewAction;
use App\Filament\Resources\Comments\CommentResource;
use Filament\Tables\Table;

class CommentsTable
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
            ->recordUrl(fn ($record) => CommentResource::getUrl('view', ['record' => $record]))
            ->recordActions([
                \Filament\Actions\ViewAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
