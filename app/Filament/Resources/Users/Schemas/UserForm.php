<?php

declare(strict_types=1);

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;

final class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('dni')
                    ->required()
                    ->unique(table: 'users', column: 'dni', ignoreRecord: true)
                    ->disabledOn('edit'),

                TextInput::make('username')
                    ->required()
                    ->unique(table: 'users', column: 'username', ignoreRecord: true),

                FileUpload::make('img')
                    ->image()
                    ->maxSize(1024 * 5)
                    ->dehydrated(function ($state) {
                        return filled($state);
                    })
                    ->required(fn (string $operation): bool => $operation === 'create'),
                TextInput::make('firstname')
                    ->required()
                    ->disabledOn('edit'),

                TextInput::make('lastname')
                    ->required()
                    ->disabledOn('edit'),

                TextInput::make('address')
                    ->required()
                    ->disabledOn('edit'),

                TextInput::make('postalCode')
                    ->required()
                    ->disabledOn('edit'),

                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required()
                    ->unique(table: 'users', column: 'email', ignoreRecord: true)
                    ->disabledOn('edit'),

                TextInput::make('email_verified_at')
                    ->default(now())
                    ->hidden()
                    ->dehydrateStateUsing(fn ($state) => $state ?? now()),

                TextInput::make('password')
                    ->password()
                    ->required(fn (string $operation): bool => $operation === 'create')
                    ->dehydrated(fn ($state) => filled($state))
                    ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                    ->disabled(fn (string $operation): bool => $operation === 'edit'),
            ]);
    }
}
