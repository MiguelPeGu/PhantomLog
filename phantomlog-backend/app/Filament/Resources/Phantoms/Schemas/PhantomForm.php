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
                TextInput::make('location')
                    ->required(),
                \Filament\Forms\Components\Textarea::make('description')
                    ->required()
                    ->columnSpanFull(),
                \Filament\Forms\Components\Textarea::make('evidence')
                    ->label('Evidencias Técnicas')
                    ->placeholder('Ej: CEM Nivel 5, Orbes Espectrales...')
                    ->columnSpanFull(),
                \Filament\Forms\Components\Textarea::make('strengths')
                    ->label('Fortalezas'),
                \Filament\Forms\Components\Textarea::make('weaknesses')
                    ->label('Debilidades'),
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
