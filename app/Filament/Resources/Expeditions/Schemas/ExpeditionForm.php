<?php

declare(strict_types=1);

namespace App\Filament\Resources\Expeditions\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

final class ExpeditionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'username')
                    ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->firstname} {$record->lastname} - {$record->username}")
                    ->searchable(['firstname', 'lastname', 'username'])
                    ->preload()
                    ->required()
                    ->disabledon('edit'),
                Select::make('phantom_id')
                    ->relationship('phantom', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('name')
                    ->required()
                    ->disabledOn('edit'),
                TextInput::make('description')
                    ->required()
                    ->disabledOn('edit'),
                TextInput::make('location')
                    ->required(),
                DateTimePicker::make('date')
                    ->required(),
            ]);
    }
}
