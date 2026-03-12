<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('users')->get();

        $invoices = [
            [
                'id'         => Str::uuid(),
                'n_invoice'  => 'INV-2024-0001',
                'user_id'    => $users[0]->id,
                'dni'        => $users[0]->dni,
                'first_name' => $users[0]->firstname,
                'last_name'  => $users[0]->lastname,
                'address'    => $users[0]->address,
                'tax'        => 21,
                'total'      => 139.94,
                'created_at' => now()->subDays(20),
                'updated_at' => now()->subDays(20),
            ],
            [
                'id'         => Str::uuid(),
                'n_invoice'  => 'INV-2024-0002',
                'user_id'    => $users[1]->id,
                'dni'        => $users[1]->dni,
                'first_name' => $users[1]->firstname,
                'last_name'  => $users[1]->lastname,
                'address'    => $users[1]->address,
                'tax'        => 21,
                'total'      => 349.00,
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(15),
            ],
            [
                'id'         => Str::uuid(),
                'n_invoice'  => 'INV-2024-0003',
                'user_id'    => $users[2]->id,
                'dni'        => $users[2]->dni,
                'first_name' => $users[2]->firstname,
                'last_name'  => $users[2]->lastname,
                'address'    => $users[2]->address,
                'tax'        => 21,
                'total'      => 199.99,
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(10),
            ],
        ];

        DB::table('invoices')->insert($invoices);
    }
}