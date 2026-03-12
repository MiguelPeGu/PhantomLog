<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // 1. Tablas base sin dependencias
            UserSeeder::class,
            PhantomSeeder::class,
            ProductSeeder::class,

            // 2. Tablas que dependen de users y phantoms   
            ForumSeeder::class,
            ExpeditionSeeder::class,

            // 3. Tablas que dependen    de forums y users
            ReportSeeder::class,
            FollowerSeeder::class,

            // 4. Tablas que dependen de reports y users
            CommentSeeder::class,

            // 5. Tablas de facturación
            InvoiceSeeder::class,
            InvoiceDetailSeeder::class,
        ]);
    }
}