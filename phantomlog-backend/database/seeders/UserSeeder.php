<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'dni'               => '77494609K',
                'username'          => 'Barashkin84',
                'img'               => 'https://api.dicebear.com/9.x/lorelei/svg?seed=Adrian',
                'firstname'         => 'Adrian',
                'lastname'          => 'Barashkin',
                'address'           => 'Calle Real 45, Málaga',
                'postalCode'        => '29001',
                'email'             => 'adrian@gmail.com',
                'email_verified_at' => now(),
                'password'          => Hash::make('12341234'),
                'role'              => 'admin',
            ],
            [
                'dni'               => '77494609P',
                'username'          => 'javierargonila',
                'img'               => 'https://api.dicebear.com/9.x/lorelei/svg?seed=Javier',
                'firstname'         => 'Javier',
                'lastname'          => 'Argonila',
                'address'           => 'Avenida de la Aurora 12, Málaga',
                'postalCode'        => '29002',
                'email'             => 'javier@gmail.com',
                'email_verified_at' => now(),
                'password'          => Hash::make('12341234'),
                'role'              => 'user',
            ],
            [
                'dni'               => '77494608H',
                'username'          => 'InfernalGhost',
                'img'               => 'https://api.dicebear.com/9.x/lorelei/svg?seed=Felix',
                'firstname'         => 'Miguel',
                'lastname'          => 'Pérez Gutiérrez',
                'address'           => 'Calle Mayor 12, Alhaurín de la Torre',
                'postalCode'        => '29130',
                'email'             => 'miguel@gmail.com',
                'email_verified_at' => now(),
                'password'          => Hash::make('123123'),
                'role'              => 'admin',
            ],
            [
                'dni'               => '12345678A',
                'username'          => 'seraphim_investigator',
                'img'               => 'https://api.dicebear.com/9.x/lorelei/svg?seed=Carlos',
                'firstname'         => 'Carlos',
                'lastname'          => 'Martínez López',
                'address'           => 'Calle Mayor 12, Madrid',
                'postalCode'        => '28001',
                'email'             => 'carlos.martinez@example.com',
                'email_verified_at' => now(),
                'password'          => Hash::make('password123'),
            ],
            [
                'dni'               => '87654321B',
                'username'          => 'shadow_tracker',
                'img'               => 'https://api.dicebear.com/9.x/lorelei/svg?seed=Luna',
                'firstname'         => 'Laura',
                'lastname'          => 'García Sánchez',
                'address'           => 'Avenida Diagonal 45, Barcelona',
                'postalCode'        => '08005',
                'email'             => 'laura.garcia@example.com',
                'email_verified_at' => now(),
                'password'          => Hash::make('password123'),
            ],
        ];

        foreach ($users as $data) {
            User::create($data);
        }
    }
}