<?php

declare(strict_types=1);

namespace App\Filament\Resources\Reports\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

final class ReportForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Section::make('Relaciones')
                    ->schema([
                        Select::make('forum_id')
                            ->relationship('forum', 'title')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->disabledOn('edit'),
                        Select::make('user_id')
                            ->relationship('user', 'username')
                            ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->firstname} {$record->lastname} - {$record->username}")
                            ->searchable(['firstname', 'lastname', 'username'])
                            ->preload()
                            ->required()
                            ->disabledon('edit'),
                    ])->columns(2),

                \Filament\Schemas\Components\Section::make('Contenido del Reporte')
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->disabledOn('edit'),
                        \Filament\Forms\Components\Textarea::make('description')
                            ->required()
                            ->disabledOn('edit')
                            ->rows(5)
                            ->columnSpanFull(),
                        TextInput::make('score')
                            ->required()
                            ->disabledOn('edit')
                            ->numeric()
                            ->default(0),
                    ]),
            ]);
    }
}
