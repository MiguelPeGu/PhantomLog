<?php

declare(strict_types=1);

use App\Models\Report;
use App\Models\Forum;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('report has all required fields filled', function () {
    $report = Report::factory()->create();

    expect($report->id)->not->toBeNull()
        ->and($report->title)->not->toBeNull()
        ->and($report->description)->not->toBeNull()
        ->and($report->forum_id)->not->toBeNull()
        ->and($report->user_id)->not->toBeNull()
        ->and($report->score)->toBeGreaterThanOrEqual(0);
});

test('report belongs to a forum and a user', function () {
    $report = Report::factory()->create();

    expect($report->forum)->toBeInstanceOf(Forum::class)
        ->and($report->user)->toBeInstanceOf(User::class);
});
