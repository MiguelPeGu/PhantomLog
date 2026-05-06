<?php

declare(strict_types=1);

namespace App\Filament\Resources\Reports\Schemas;

use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

final class ReportForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Vínculos del Hallazgo')
                    ->schema([
                        Select::make('forum_id')
                            ->label('Foro del Expediente')
                            ->relationship('forum', 'title')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->disabledOn('edit'),
                        Select::make('user_id')
                            ->label('Investigador de Campo')
                            ->relationship('user', 'username')
                            ->getOptionLabelFromRecordUsing(fn (User $record): string => sprintf('%s %s - %s', $record->firstname, $record->lastname, $record->username))
                            ->searchable(['firstname', 'lastname', 'username'])
                            ->preload()
                            ->required()
                            ->disabledon('edit'),
                    ])->columns(2),

                Section::make('Detalle de la Evidencia')
                    ->schema([
                        TextInput::make('title')
                            ->label('Título del Reporte')
                            ->required()
                            ->minLength(5)
                            ->maxLength(255)
                            ->regex('/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s?¿!¡]+$/')
                            ->validationMessages([
                                'regex' => 'El título contiene caracteres no permitidos.',
                                'min' => 'Mínimo 5 caracteres.',
                            ])
                            ->disabledOn('edit'),
                        Textarea::make('description')
                            ->label('Descripción de los Hechos')
                            ->required()
                            ->minLength(10)
                            ->maxLength(5000)
                            ->validationMessages([
                                'min' => 'La descripción debe ser más detallada.',
                            ])
                            ->disabledOn('edit')
                            ->rows(5)
                            ->columnSpanFull(),
                        TextInput::make('score')
                            ->label('Nivel de Credibilidad')
                            ->required()
                            ->disabledOn('edit')
                            ->numeric()
                            ->default(0),
                    ]),
            ]);
    }
}
