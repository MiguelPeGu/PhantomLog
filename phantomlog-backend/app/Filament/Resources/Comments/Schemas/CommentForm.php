<?php

declare(strict_types=1);

namespace App\Filament\Resources\Comments\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

final class CommentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('report_id')
                    ->relationship('report', 'title')
                    ->searchable(['title'])
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
                TextInput::make('content')
                    ->required()
                    ->disabledOn('edit'),
                TextInput::make('score')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->disabledOn('edit'),
            ]);
    }
}
