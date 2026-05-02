<?php

namespace App\Filament\Resources\Expeditions\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Schema;

class ExpeditionInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Detalles de la Expedición')
                    ->tabs([
                        Tabs\Tab::make('Misión')
                            ->icon('heroicon-o-map')
                            ->schema([
                                Section::make('Planificación')
                                    ->schema([
                                        TextEntry::make('name')->label('Nombre de la Misión')->weight('bold'),
                                        TextEntry::make('location')->label('Ubicación Objetivo'),
                                        TextEntry::make('date')->label('Fecha Programada')->dateTime(),
                                        TextEntry::make('phantom.name')->label('Objetivo (Fantasma)'),
                                        TextEntry::make('user.username')->label('Líder de Expedición'),
                                        TextEntry::make('description')->label('Instrucciones')->columnSpanFull(),
                                    ])->columns(2),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }
}
