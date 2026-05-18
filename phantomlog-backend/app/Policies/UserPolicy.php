<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

final class UserPolicy
{
    public function accessAdmin(User $user): bool
    {
        return $user->role === 'admin';
    }
}
