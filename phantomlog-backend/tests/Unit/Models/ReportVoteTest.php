<?php

declare(strict_types=1);

use App\Models\ReportVote;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('report vote has all required fields filled', function () {
    $vote = ReportVote::factory()->create();

    expect($vote->id)->not->toBeNull()
        ->and($vote->report_id)->not->toBeNull()
        ->and($vote->user_id)->not->toBeNull()
        ->and(in_array($vote->type, ['upvote', 'downvote']))->toBeTrue();
});

test('report vote belongs to a report and a user', function () {
    $vote = ReportVote::factory()->create();

    expect($vote->report)->toBeInstanceOf(Report::class)
        ->and($vote->user)->toBeInstanceOf(User::class);
});
