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
                    ->label('Nombre de la Entidad')
                    ->required()
                    ->maxLength(100)
                    ->regex('/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/')
                    ->validationMessages([
                        'regex' => 'El nombre contiene caracteres no permitidos.',
                    ]),
                TextInput::make('type')
                    ->label('Clasificación / Tipo')
                    ->required()
                    ->maxLength(50)
                    ->regex('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/')
                    ->validationMessages([
                        'regex' => 'El tipo contiene caracteres no permitidos.',
                    ]),
                TextInput::make('location')
                    ->label('Zona de Avistamiento')
                    ->required()
                    ->maxLength(40)
                    ->regex('/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\-\/ºª]+$/')
                    ->validationMessages([
                        'max' => 'Máximo 40 caracteres.',
                        'regex' => 'La ubicación contiene caracteres no permitidos.',
                    ]),
                \Filament\Forms\Components\Textarea::make('description')
                    ->label('Descripción del Ente')
                    ->required()
                    ->maxLength(2000)
                    ->columnSpanFull(),
                \Filament\Forms\Components\Textarea::make('evidence')
                    ->label('Evidencias Técnicas / Pruebas')
                    ->placeholder('Ej: CEM Nivel 5, Orbes Espectrales...')
                    ->maxLength(1000)
                    ->columnSpanFull(),
                \Filament\Forms\Components\Textarea::make('strengths')
                    ->maxLength(500)
                    ->label('Fortalezas Espectrales'),
                \Filament\Forms\Components\Textarea::make('weaknesses')
                    ->maxLength(500)
                    ->label('Vulnerabilidades Conocidas'),
                FileUpload::make('image')
                    ->image()
                    ->disk('public')
                    ->directory('images')
                    ->visibility('public')
                    ->maxSize(1024 * 5)
                    ->dehydrated(function ($state) {
                        return filled($state);
                    })
                    ->required(fn (string $operation): bool => $operation === 'create')
                    ->columnSpanFull(),

            ]);
    }
}
