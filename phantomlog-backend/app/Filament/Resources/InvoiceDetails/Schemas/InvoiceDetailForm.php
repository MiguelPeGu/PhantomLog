<?php

declare(strict_types=1);

namespace App\Filament\Resources\InvoiceDetails\Schemas;

use App\Models\Invoice;
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
            $rawPrice = $get('price');
            $price ??= is_numeric($rawPrice) ? (float) $rawPrice : 0.0;

            $rawTax = $get('tax');
            $tax ??= is_numeric($rawTax) ? (int) $rawTax : 0;

            $rawQuantity = $get('quantity');
            $quantity = is_numeric($rawQuantity) ? (int) $rawQuantity : 0;

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
                    ->getOptionLabelFromRecordUsing(fn (Invoice $record): string => sprintf('#%s - %s', $record->id, $record->created_at->format('d/m/Y H:i:s')))
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
                    ->getOptionLabelFromRecordUsing(fn (Product $record): string => sprintf('%s - %s', $record->sku, $record->title))
                    ->searchable(['sku', 'title'])
                    ->preload()
                    ->required()
                    ->disabledOn('edit')
                    ->live()
                    ->afterStateUpdated(static function (?string $state, Set $set, Get $get) use ($recalculate): void {
                        if (! $state) {
                            return;
                        }

                        $product = Product::query()->find($state);
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
                    ->afterStateUpdated(static function (?string $state, Set $set, Get $get) use ($recalculate): void {
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
