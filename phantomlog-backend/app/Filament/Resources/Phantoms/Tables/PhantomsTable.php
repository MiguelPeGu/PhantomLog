<?php

namespace App\Filament\Resources\Phantoms\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use App\Filament\Resources\Phantoms\PhantomResource;
use Filament\Tables\Table;

class PhantomsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->label('Foto')
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
            ->recordUrl(fn ($record) => PhantomResource::getUrl('view', ['record' => $record]))
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
