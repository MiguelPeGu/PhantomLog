<?php

namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use App\Filament\Resources\Users\UserResource;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('img')
                    ->label('Avatar')
                    ->circular(),
                TextColumn::make('username')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('firstname')
                    ->label('Nombre')
                    ->searchable(),
                TextColumn::make('lastname')
                    ->label('Apellidos')
                    ->searchable(),
                TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),
                TextColumn::make('role')
                    ->label('Rol')
                    ->badge(),
                TextColumn::make('created_at')
                    ->label('Registrado')
                    ->dateTime('d/m/Y')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordUrl(fn ($record) => UserResource::getUrl('view', ['record' => $record]))
            ->recordActions([
                \Filament\Actions\ViewAction::make()->label('Ver'),
                \Filament\Actions\EditAction::make()->label('Editar'),
                \Filament\Actions\DeleteAction::make()->label('Borrar'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()->label('Borrar seleccionados'),
                ])->label('Acciones en lote'),
            ]);
    }
}
