<?php

declare(strict_types=1);

use App\Models\Forum;
use App\Models\User;
use App\Models\Report;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('forum belongs to a user', function () {
    $user = User::factory()->create();
    $forum = Forum::factory()->create(['user_id' => $user->id]);

    expect($forum->user->id)->toBe($user->id);
});

test('forum has reports', function () {
    $forum = Forum::factory()->has(Report::factory()->count(2))->create();

    expect($forum->reports)->toHaveCount(2)
        ->and($forum->reports->first())->toBeInstanceOf(Report::class);
});
