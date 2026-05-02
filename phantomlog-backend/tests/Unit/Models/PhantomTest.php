<?php

declare(strict_types=1);

use App\Models\Phantom;
use App\Models\Expedition;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('phantom has required attributes', function () {
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

test('phantom has expeditions relationship', function () {
    $phantom = Phantom::factory()->has(Expedition::factory()->count(3))->create();

    expect($phantom->expeditions)->toHaveCount(3)
        ->and($phantom->expeditions->first())->toBeInstanceOf(Expedition::class);
});

test('phantom uuid is generated automatically', function () {
    $phantom = Phantom::factory()->create();
    
    expect($phantom->id)->not->toBeNull()
        ->and(strlen($phantom->id))->toBe(36);
});
