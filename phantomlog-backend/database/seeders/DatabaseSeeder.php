<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // 1. Sin dependencias
            UserSeeder::class,
            PhantomSeeder::class,
            ProductSeeder::class,

            // 2. Dependen de User y/o Phantom
            ForumSeeder::class,
            ExpeditionSeeder::class,
            EnrollmentSeeder::class,

            // 3. Dependen de Forum y User
            ReportSeeder::class,
            ReportVoteSeeder::class,
            FollowerSeeder::class,

            // 4. Dependen de Report y User
            CommentSeeder::class,

            // 5. Facturación
            InvoiceSeeder::class,
            InvoiceDetailSeeder::class,
        ]);
    }
}
