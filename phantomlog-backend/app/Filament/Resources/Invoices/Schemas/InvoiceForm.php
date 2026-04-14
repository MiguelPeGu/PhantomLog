<?php

declare(strict_types=1);

namespace App\Filament\Resources\Invoices\Schemas;

use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;

final class InvoiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('n_invoice')
                    ->required()
                    ->disabledon('edit'),
                Select::make('user_id')
                    ->relationship('user', 'username')
                    ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->firstname} {$record->lastname} - {$record->username}")
                    ->searchable(['firstname', 'lastname', 'username'])
                    ->preload()
                    ->required()
                    ->disabledOn('edit')
                    ->live()
                    ->afterStateUpdated(function (?string $state, Set $set) {
                        if (! $state) {
                            return;
                        }

                        $user = User::find($state);
                        if (! $user) {
                            return;
                        }

                        $set('dni', $user->dni);
                        $set('first_name', $user->firstname);
                        $set('last_name', $user->lastname);
                        $set('address', $user->address);
                    }),

                TextInput::make('dni')
                    ->required()
                    ->disabledOn('edit'),
                TextInput::make('first_name')
                    ->required()
                    ->disabledOn('edit'),
                TextInput::make('last_name')
                    ->required()
                    ->disabledOn('edit'),
                TextInput::make('address')
                    ->required(),
                TextInput::make('tax')
                    ->required()
                    ->numeric()
                    ->default(21),
                TextInput::make('total')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->disabledOn('edit'),
            ]);
    }
}
