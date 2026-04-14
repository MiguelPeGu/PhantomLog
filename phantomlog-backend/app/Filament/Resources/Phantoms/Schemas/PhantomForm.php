<?php

declare(strict_types=1);

namespace App\Filament\Resources\Phantoms\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

final class PhantomForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('type')
                    ->required(),
                TextInput::make('description')
                    ->required(),
                TextInput::make('location')
                    ->required(),
                FileUpload::make('image')
                    ->image()
                    ->maxSize(1024 * 5)
                    ->dehydrated(function ($state) {
                        return filled($state);
                    })
                    ->required(fn (string $operation): bool => $operation === 'create'),

            ]);
    }
}
