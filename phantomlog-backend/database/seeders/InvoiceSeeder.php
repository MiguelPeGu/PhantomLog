<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

final class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            return;
        }

        $invoices = [
            [
                'user' => $users[0] ?? null,
                'n_invoice' => 'INV-2024-0001',
                'tax' => 21,
                'total' => 139.94,
            ],
            [
                'user' => $users[1] ?? null,
                'n_invoice' => 'INV-2024-0002',
                'tax' => 21,
                'total' => 349.00,
            ],
            [
                'user' => $users[2] ?? null,
                'n_invoice' => 'INV-2024-0003',
                'tax' => 21,
                'total' => 289.94,
            ],
        ];

        foreach ($invoices as $data) {
            $user = $data['user'] ?? null;
            if ($user instanceof User) {
                $user->invoices()->create([
                    'n_invoice' => $data['n_invoice'],
                    'dni' => $user->dni,
                    'first_name' => $user->firstname,
                    'last_name' => $user->lastname,
                    'address' => $user->address,
                    'postal_code' => $user->postalCode,
                    'tax' => $data['tax'],
                    'total' => $data['total'],
                ]);
            }
        }
    }
}
