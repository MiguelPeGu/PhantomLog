<?php

namespace App\Filament\Resources\Invoices\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class InvoiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('n_invoice')
                    ->required()
                    ->disabledon('edit'),
                TextInput::make('user_id')
                    ->required()
                    ->disabledon('edit'),
                TextInput::make('dni')
                    ->required()
                    ->disabledon('edit'),
                TextInput::make('first_name')
                    ->required()
                    ->disabledon('edit'),
                TextInput::make('last_name')
                    ->required()
                    ->disabledon('edit'),
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
                    ->disabledon('edit'),
            ]);
    }
}
