<?php

namespace App\Filament\Resources\Forums\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ForumForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                TextInput::make('description')
                    ->required(),
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('followers')
                    ->required()
                    ->numeric(),
            ]);
    }
}
