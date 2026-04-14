<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        $invoices = [
            [
                'user'       => $users[0],
                'n_invoice'  => 'INV-2024-0001',
                'tax'        => 21,
                'total'      => 139.94,
            ],
            [
                'user'       => $users[1],
                'n_invoice'  => 'INV-2024-0002',
                'tax'        => 21,
                'total'      => 349.00,
            ],
            [
                'user'       => $users[2],
                'n_invoice'  => 'INV-2024-0003',
                'tax'        => 21,
                'total'      => 289.94,
            ],
        ];

        foreach ($invoices as $data) {
            $user = $data['user'];
            $user->invoices()->create([
                'n_invoice'  => $data['n_invoice'],
                'dni'        => $user->dni,
                'first_name' => $user->firstname,
                'last_name'  => $user->lastname,
                'address'    => $user->address,
                'tax'        => $data['tax'],
                'total'      => $data['total'],
            ]);
        }
    }
}