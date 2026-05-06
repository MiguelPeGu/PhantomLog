<?php

declare(strict_types=1);

namespace App\Filament\Resources\Phantoms\Tables;

use App\Filament\Resources\Phantoms\PhantomResource;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

final class PhantomsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->label('Foto')
                    ->disk('public')
                    ->circular(),
                TextColumn::make('name')
                    ->label('Nombre')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('type')
                    ->label('Tipo')
                    ->badge()
                    ->searchable(),
                TextColumn::make('evidence')
                    ->label('Evidencias')
                    ->wrap()
                    ->searchable(),
                TextColumn::make('location')
                    ->label('Ubicación')
                    ->searchable(),
            ])
            ->filters([
                //
            ])
            ->recordUrl(fn ($record): string => PhantomResource::getUrl('view', ['record' => $record]))
            ->recordActions([
                ViewAction::make()->label('Ver'),
                EditAction::make()->label('Editar'),
                DeleteAction::make()->label('Borrar'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()->label('Borrar seleccionados'),
                ])->label('Acciones en lote'),
            ]);
    }
}
