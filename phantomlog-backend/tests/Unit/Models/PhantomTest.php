<?php

declare(strict_types=1);

use App\Models\Expedition;
use App\Models\Phantom;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('phantom has required attributes', function (): void {
    $phantom = Phantom::factory()->create([
        'name' => 'El Monje de San Telmo',
        'type' => 'Aparición',
        'location' => 'Málaga',
        'evidence' => 'CEM 5, Orbes',
    ]);

    expect($phantom->name)->toBe('El Monje de San Telmo')
        ->and($phantom->type)->toBe('Aparición')
        ->and($phantom->location)->toBe('Málaga')
        ->and($phantom->evidence)->toBe('CEM 5, Orbes');
});

test('phantom has expeditions relationship', function (): void {
    $phantom = Phantom::factory()->has(Expedition::factory()->count(3))->create();

    expect($phantom->expeditions)->toHaveCount(3)
        ->and($phantom->expeditions->first())->toBeInstanceOf(Expedition::class);
});

test('phantom uuid is generated automatically', function (): void {
    $phantom = Phantom::factory()->create();

    expect($phantom->id)->not->toBeNull()
        ->and(mb_strlen((string) $phantom->id))->toBe(36);
});
