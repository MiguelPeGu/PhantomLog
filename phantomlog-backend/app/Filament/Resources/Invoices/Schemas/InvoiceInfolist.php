<?php

namespace App\Filament\Resources\Invoices\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Schema;

class InvoiceInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Detalles de la Factura')
                    ->tabs([
                        Tabs\Tab::make('Facturación')
                            ->icon('heroicon-o-receipt-refund')
                            ->schema([
                                Section::make('Datos del Cliente')
                                    ->schema([
                                        TextEntry::make('n_invoice')->label('Número de Factura')->weight('bold'),
                                        TextEntry::make('user.username')->label('Usuario'),
                                        TextEntry::make('first_name')->label('Nombre'),
                                        TextEntry::make('last_name')->label('Apellidos'),
                                        TextEntry::make('dni')->label('DNI/CIF'),
                                        TextEntry::make('address')->label('Dirección de Facturación'),
                                    ])->columns(2),
                                Section::make('Totales')
                                    ->schema([
                                        TextEntry::make('total')->label('Total Facturado')->money('EUR')->weight('bold'),
                                        TextEntry::make('tax')->label('IVA Aplicado')->suffix('%'),
                                        TextEntry::make('payment_method')->label('Método de Pago')->badge(),
                                    ])->columns(3),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }
}
