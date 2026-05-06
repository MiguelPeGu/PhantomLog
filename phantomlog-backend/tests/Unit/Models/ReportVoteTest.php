<?php

declare(strict_types=1);

use App\Models\Report;
use App\Models\ReportVote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('report vote has all required fields filled', function (): void {
    $vote = ReportVote::factory()->create();

    expect($vote->id)->not->toBeNull()
        ->and($vote->report_id)->not->toBeNull()
        ->and($vote->user_id)->not->toBeNull()
        ->and($vote->value)->toBeInt();
});

test('report vote belongs to a report and a user', function (): void {
    $vote = ReportVote::factory()->create();

    expect($vote->report)->toBeInstanceOf(Report::class)
        ->and($vote->user)->toBeInstanceOf(User::class);
});
