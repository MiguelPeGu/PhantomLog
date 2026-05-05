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
                    ->label('Investigador Responsable')
                    ->relationship('user', 'username')
                    ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->firstname} {$record->lastname} - {$record->username}")
                    ->searchable(['firstname', 'lastname', 'username'])
                    ->preload()
                    ->required()
                    ->disabledon('edit'),
                Select::make('phantom_id')
                    ->label('Entidad Objetivo')
                    ->relationship('phantom', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('name')
                    ->label('Nombre de la Misión')
                    ->required()
                    ->minLength(5)
                    ->maxLength(100)
                    ->regex('/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡]+$/')
                    ->validationMessages([
                        'regex' => 'El nombre contiene caracteres no permitidos.',
                        'min' => 'Mínimo 5 caracteres.',
                    ])
                    ->disabledOn('edit'),
                \Filament\Forms\Components\Textarea::make('description')
                    ->label('Objetivos de la Incursión')
                    ->required()
                    ->minLength(100)
                    ->maxLength(2000)
                    ->validationMessages([
                        'min' => 'Los objetivos deben ser más detallados (mínimo 100 caracteres).',
                    ])
                    ->disabledOn('edit'),
                TextInput::make('location')
                    ->label('Ubicación')
                    ->required()
                    ->maxLength(40)
                    ->regex('/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\-\/ºª]+$/')
                    ->validationMessages([
                        'max' => 'Máximo 40 caracteres.',
                        'regex' => 'La ubicación contiene caracteres no permitidos.',
                    ]),
                DateTimePicker::make('date')
                    ->label('Fecha y Hora')
                    ->required()
                    ->after('now')
                    ->validationMessages([
                        'after' => 'La incursión debe ser en el futuro.',
                    ]),
            ]);
    }
}
