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
                \Filament\Schemas\Components\Section::make('Información Personal')
                    ->description('Datos básicos del usuario')
                    ->schema([
                        TextInput::make('dni')
                            ->required()
                            ->unique(table: 'users', column: 'dni', ignoreRecord: true)
                            ->disabledOn('edit'),

                        TextInput::make('username')
                            ->required()
                            ->unique(table: 'users', column: 'username', ignoreRecord: true),

                        TextInput::make('firstname')
                            ->required()
                            ->disabledOn('edit'),

                        TextInput::make('lastname')
                            ->required()
                            ->disabledOn('edit'),
                    ])->columns(2),

                \Filament\Schemas\Components\Section::make('Contacto y Localización')
                    ->schema([
                        TextInput::make('email')
                            ->label('Email address')
                            ->email()
                            ->required()
                            ->unique(table: 'users', column: 'email', ignoreRecord: true)
                            ->disabledOn('edit'),

                        TextInput::make('address')
                            ->required()
                            ->disabledOn('edit'),

                        TextInput::make('postalCode')
                            ->required()
                            ->disabledOn('edit'),
                    ])->columns(2),

                \Filament\Schemas\Components\Section::make('Seguridad y Perfil')
                    ->schema([
                        \Filament\Forms\Components\Select::make('role')
                            ->options([
                                'admin' => 'Administrador',
                                'user' => 'Usuario',
                            ])
                            ->required()
                            ->default('user'),

                        FileUpload::make('img')
                            ->image()
                            ->disk('public')
                            ->directory('images')
                            ->visibility('public')
                            ->maxSize(1024 * 5)
                            ->dehydrated(function ($state) {
                                return filled($state);
                            })
                            ->required(fn (string $operation): bool => $operation === 'create'),

                        TextInput::make('password')
                            ->password()
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->dehydrated(fn ($state) => filled($state))
                            ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                            ->disabled(fn (string $operation): bool => $operation === 'edit'),
                    ])->columns(2),

                TextInput::make('email_verified_at')
                    ->default(now())
                    ->hidden()
                    ->dehydrateStateUsing(fn ($state) => $state ?? now()),
            ]);
    }
}
