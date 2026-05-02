<?php

declare(strict_types=1);

use App\Models\Comment;
use App\Models\Forum;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('comment has all required fields filled', function () {
    $comment = Comment::factory()->create();

    expect($comment->id)->not->toBeNull()
        ->and($comment->content)->not->toBeNull()
        ->and($comment->forum_id)->not->toBeNull()
        ->and($comment->user_id)->not->toBeNull();
});

test('comment belongs to a forum and a user', function () {
    $comment = Comment::factory()->create();

    expect($comment->forum)->toBeInstanceOf(Forum::class)
        ->and($comment->user)->toBeInstanceOf(User::class);
});
