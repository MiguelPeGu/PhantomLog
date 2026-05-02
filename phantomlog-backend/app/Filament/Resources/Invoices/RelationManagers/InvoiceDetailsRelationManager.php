<?php

namespace App\Filament\Resources\Invoices\RelationManagers;

use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class InvoiceDetailsRelationManager extends RelationManager
{
    protected static string $relationship = 'details';

    protected static ?string $recordTitleAttribute = 'title';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                TextInput::make('sku')
                    ->required(),
                TextInput::make('price')
                    ->numeric()
                    ->required(),
                TextInput::make('quantity')
                    ->numeric()
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sku'),
                TextColumn::make('title'),
                TextColumn::make('price')
                    ->money('EUR'),
                TextColumn::make('quantity'),
                TextColumn::make('total_with_tax')
                    ->money('EUR'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                //
            ])
            ->actions([
                \Filament\Actions\ViewAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                //
            ]);
    }
}
