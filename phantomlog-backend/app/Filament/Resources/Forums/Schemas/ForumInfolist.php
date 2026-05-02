<?php

namespace App\Filament\Resources\Forums\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Schema;

class ForumInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Detalles del Foro')
                    ->tabs([
                        Tabs\Tab::make('Contenido')
                            ->icon('heroicon-o-chat-bubble-left-right')
                            ->schema([
                                Section::make('Información del Foro')
                                    ->schema([
                                        TextEntry::make('title')->label('Título')->weight('bold'),
                                        TextEntry::make('user.username')->label('Creador'),
                                        TextEntry::make('description')->label('Descripción')->columnSpanFull(),
                                    ])->columns(2),
                            ]),
                        Tabs\Tab::make('Estadísticas')
                            ->icon('heroicon-o-chart-bar')
                            ->schema([
                                Section::make('Actividad')
                                    ->schema([
                                        TextEntry::make('reports_count')->label('Número de Reportes')->state(fn($record) => $record->reports()->count()),
                                        TextEntry::make('created_at')->label('Fecha de Creación')->dateTime(),
                                    ])->columns(2),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }
}
