<?php

namespace App\Filament\Resources\Reports\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ReportForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('forum_id')
                    ->required(),
                TextInput::make('user_id')
                    ->required(),
                TextInput::make('title')
                    ->required(),
                TextInput::make('description')
                    ->required(),
                TextInput::make('score')
                    ->required()
                    ->default('0'),
            ]);
    }
}
