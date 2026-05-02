<?php

declare(strict_types=1);

use App\Models\User;

test('user has default role and can be admin', function (): void {
    $user = User::factory()->create();
    expect($user->role)->toBe('user');

    $admin = User::factory()->create(['role' => 'admin']);
    expect($admin->role)->toBe('admin');
});

test('user has many forums', function (): void {
    $user = User::factory()->has(\App\Models\Forum::factory()->count(3))->create();
    expect($user->forums)->toHaveCount(3);
});
