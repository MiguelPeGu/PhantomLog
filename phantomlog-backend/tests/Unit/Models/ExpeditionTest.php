<?php

declare(strict_types=1);

use App\Models\Expedition;
use App\Models\User;
use App\Models\Phantom;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('expedition belongs to a creator and a phantom', function () {
    $user = User::factory()->create();
    $phantom = Phantom::factory()->create();
    
    $expedition = Expedition::factory()->create([
        'user_id' => $user->id,
        'phantom_id' => $phantom->id,
    ]);

    expect($expedition->creator->id)->toBe($user->id)
        ->and($expedition->phantom->id)->toBe($phantom->id);
});

test('expedition can have many participants', function () {
    $expedition = Expedition::factory()->create();
    $users = User::factory()->count(5)->create();
    
    $expedition->participants()->attach($users);

    expect($expedition->participants)->toHaveCount(5);
});
