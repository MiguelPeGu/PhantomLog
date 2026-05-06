<?php

declare(strict_types=1);

namespace App\Filament\Resources\Phantoms\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;

final class PhantomInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Detalles del Fantasma')
                    ->tabs([
                        Tab::make('General')
                            ->icon('heroicon-o-sparkles')
                            ->schema([
                                Section::make('Identidad')
                                    ->schema([
                                        TextEntry::make('name')->label('Nombre')->weight('bold'),
                                        TextEntry::make('type')->label('Tipo')->badge(),
                                        TextEntry::make('location')->label('Ubicación Habitual'),
                                        TextEntry::make('description')->label('Descripción')->columnSpanFull(),
                                    ])->columns(3),
                            ]),
                        Tab::make('Investigación')
                            ->icon('heroicon-o-beaker')
                            ->schema([
                                Section::make('Datos Técnicos')
                                    ->schema([
                                        TextEntry::make('evidence')->label('Evidencias Requeridas')->color('warning'),
                                        TextEntry::make('strengths')->label('Fortalezas de la Entidad'),
                                        TextEntry::make('weaknesses')->label('Debilidades Detectadas'),
                                    ]),
                            ]),
                        Tab::make('Multimedia')
                            ->icon('heroicon-o-photo')
                            ->schema([
                                Section::make('Evidencia Visual')
                                    ->schema([
                                        ImageEntry::make('image')->hiddenLabel()->width(300),
                                    ]),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }
}
