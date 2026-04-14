<?php

declare(strict_types=1);

namespace App\Filament\Resources\InvoiceDetails\Schemas;

use App\Models\Product;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;

final class InvoiceDetailForm
{
    public static function configure(Schema $schema): Schema
    {
        $recalculate = static function (Set $set, Get $get, ?float $price = null, ?int $tax = null): void {
            $price = $price ?? (float) $get('price');
            $tax = $tax ?? (int) $get('tax');
            $quantity = (int) $get('quantity');

            if (! $price || ! $quantity) {
                return;
            }

            $total = $price * $quantity;
            $totalWithTax = $total * (1 + $tax / 100);

            $set('total', number_format($total, 2, '.', ''));
            $set('total_with_tax', number_format($totalWithTax, 2, '.', ''));
        };

        return $schema
            ->components([
                Select::make('invoice_id')
                    ->relationship('invoice', 'id')
                    ->getOptionLabelFromRecordUsing(fn ($record) => "#{$record->id} - {$record->created_at?->format('d/m/Y H:i:s')}")
                    ->searchable(['id'])
                    ->preload()
                    ->required()
                    ->disabledOn('edit')
                    ->live(),

                Select::make('product_id')
                    ->relationship(
                        name: 'product',
                        titleAttribute: 'sku',
                    )
                    ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->sku} - {$record->title}")
                    ->searchable(['sku', 'title'])
                    ->preload()
                    ->required()
                    ->disabledOn('edit')
                    ->live()
                    ->afterStateUpdated(static function (?string $state, Set $set, Get $get) use ($recalculate) {
                        if (! $state) {
                            return;
                        }

                        $product = Product::find($state);
                        if (! $product) {
                            return;
                        }

                        $set('sku', $product->sku);
                        $set('title', $product->title);
                        $set('price', $product->price);
                        $set('tax', $product->tax);

                        $recalculate($set, $get, (float) $product->price, (int) $product->tax);
                    }),

                TextInput::make('sku')
                    ->label('SKU')
                    ->required()
                    ->readOnly(),
                TextInput::make('title')
                    ->required()
                    ->readOnly(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('€')
                    ->readOnly(),
                TextInput::make('tax')
                    ->required()
                    ->numeric()
                    ->readOnly(),
                TextInput::make('quantity')
                    ->required()
                    ->numeric()
                    ->live()
                    ->afterStateUpdated(static function (?string $state, Set $set, Get $get) use ($recalculate) {
                        $recalculate($set, $get);
                    }),
                TextInput::make('total')
                    ->required()
                    ->numeric()
                    ->prefix('€')
                    ->readOnly(),
                TextInput::make('total_with_tax')
                    ->required()
                    ->numeric()
                    ->prefix('€')
                    ->readOnly(),
            ]);
    }
}
