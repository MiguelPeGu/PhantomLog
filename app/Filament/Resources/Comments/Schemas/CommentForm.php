<?php

namespace App\Filament\Resources\Comments\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CommentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('report_id')
                    ->required(),
                TextInput::make('user_id')
                    ->required(),
                TextInput::make('content')
                    ->required(),
                TextInput::make('score')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
