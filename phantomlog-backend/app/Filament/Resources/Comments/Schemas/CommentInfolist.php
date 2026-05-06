<?php

declare(strict_types=1);

namespace App\Filament\Resources\Comments\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

final class CommentInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Comentario')
                ->columns(2)
                ->schema([
                    TextEntry::make('report.title')->label('Reporte'),
                    TextEntry::make('user.username')->label('Usuario'),
                    TextEntry::make('score')->label('Puntuación')->badge(),
                    TextEntry::make('content')->label('Contenido')->columnSpanFull(),
                    TextEntry::make('created_at')->label('Creado')->dateTime(),
                    TextEntry::make('updated_at')->label('Actualizado')->dateTime(),
                ]),
        ]);
    }
}
