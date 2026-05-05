<?php

declare(strict_types=1);

namespace App\Filament\Resources\Forums\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

final class ForumForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Section::make('Detalles del Expediente')
                    ->schema([
                        TextInput::make('title')
                            ->label('Título del Foro')
                            ->required()
                            ->minLength(10)
                            ->maxLength(100)
                            ->regex('/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡]+$/')
                            ->validationMessages([
                                'regex' => 'El título contiene caracteres no permitidos.',
                                'min' => 'Mínimo 10 caracteres.',
                            ])
                            ->disabledon('edit'),
                        \Filament\Forms\Components\Textarea::make('description')
                            ->label('Descripción de la Temática')
                            ->required()
                            ->minLength(20)
                            ->maxLength(2000)
                            ->validationMessages([
                                'min' => 'La descripción debe ser más detallada (mínimo 20 caracteres).',
                            ])
                            ->disabledon('edit'),
                    ]),
                \Filament\Schemas\Components\Section::make('Investigador Principal')
                    ->schema([
                        Select::make('user_id')
                            ->label('Creador del Hilo')
                            ->relationship('user', 'username')
                            ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->firstname} {$record->lastname} - {$record->username}")
                            ->searchable(['firstname', 'lastname', 'username'])
                            ->preload()
                            ->required()
                            ->disabledon('edit'),
                    ]),
            ]);
    }
}
