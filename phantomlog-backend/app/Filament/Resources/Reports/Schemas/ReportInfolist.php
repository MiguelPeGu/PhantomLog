<?php

namespace App\Filament\Resources\Reports\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Schema;

class ReportInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Detalles del Reporte')
                    ->tabs([
                        Tabs\Tab::make('Contenido')
                            ->icon('heroicon-o-document-text')
                            ->schema([
                                Section::make('Información Principal')
                                    ->schema([
                                        TextEntry::make('title')->label('Título')->weight('bold'),
                                        TextEntry::make('forum.title')->label('Foro'),
                                        TextEntry::make('user.username')->label('Autor'),
                                        TextEntry::make('score')->label('Puntuación')->badge(),
                                        TextEntry::make('description')->label('Descripción')->columnSpanFull(),
                                    ])->columns(2),
                            ]),
                        Tabs\Tab::make('Metadatos')
                            ->icon('heroicon-o-information-circle')
                            ->schema([
                                Section::make('Trazabilidad')
                                    ->schema([
                                        TextEntry::make('id')->label('ID')->copyable(),
                                        TextEntry::make('created_at')->label('Fecha de Creación')->dateTime(),
                                        TextEntry::make('updated_at')->label('Última Actualización')->dateTime(),
                                    ])->columns(2),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }
}
