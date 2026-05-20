<?php

declare(strict_types=1);

namespace App\Filament\Resources\Users\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;

final class UserInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Detalles del Usuario')
                    ->tabs([
                        Tab::make('Perfil')
                            ->icon('heroicon-o-user')
                            ->schema([
                                Section::make('Información Básica')
                                    ->schema([
                                        TextEntry::make('username')->label('Nombre de Usuario')->weight('bold'),
                                        TextEntry::make('dni')->label('DNI'),
                                        TextEntry::make('firstname')->label('Nombre'),
                                        TextEntry::make('lastname')->label('Apellidos'),
                                        TextEntry::make('role')->label('Rol')->badge(),
                                    ])->columns(2),
                                Section::make('Avatar')
                                    ->schema([
                                        ImageEntry::make('img')
                                            ->hiddenLabel()
                                            ->circular()
                                            ->extraImgAttributes(['referrerpolicy' => 'no-referrer']),
                                    ]),
                            ]),
                        Tab::make('Contacto')
                            ->icon('heroicon-o-envelope')
                            ->schema([
                                Section::make('Datos de Contacto')
                                    ->schema([
                                        TextEntry::make('email')->label('Correo Electrónico')->copyable(),
                                        TextEntry::make('address')->label('Dirección'),
                                        TextEntry::make('postalCode')->label('Código Postal'),
                                    ])->columns(2),
                            ]),
                        Tab::make('Sistema')
                            ->icon('heroicon-o-cog')
                            ->schema([
                                Section::make('Metadatos')
                                    ->schema([
                                        TextEntry::make('id')->label('ID de Sistema')->copyable(),
                                        TextEntry::make('created_at')->label('Fecha de Registro')->dateTime(),
                                        TextEntry::make('updated_at')->label('Última Actualización')->dateTime(),
                                    ])->columns(2),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }
}
