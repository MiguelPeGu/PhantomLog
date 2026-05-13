<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Forum;
use Illuminate\Database\Seeder;

final class ForumSeeder extends Seeder
{
    public function run(): void
    {
        Forum::factory()->count(30)->create();
    }
}
