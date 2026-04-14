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
                Select::make('forum_id')
                    ->relationship('forum', 'title') // ajusta 'title' al campo que quieras mostrar
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
                TextInput::make('title')
                    ->required()
                    ->disabledOn('edit'),
                TextInput::make('description')
                    ->required()
                    ->disabledOn('edit'),
                TextInput::make('score')
                    ->required()
                    ->disabledOn('edit')
                    ->default('0'),
            ]);
    }
}
