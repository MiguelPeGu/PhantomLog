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
                'dni'               => '12345678A',
                'username'          => 'ghost_hunter_01',
                'img'               => 'https://api.dicebear.com/9.x/lorelei/svg?seed=Felix',
                'firstname'         => 'Carlos',
                'lastname'          => 'Martínez López',
                'address'           => 'Calle Mayor 12, Madrid',
                'postalCode'        => '28001',
                'email'             => 'carlos.martinez@example.com',
                'email_verified_at' => now(),
                'password'          => Hash::make('password123'),
            ],[
                'dni'               => '77494608H',
                'username'          => 'InfernalGhost',
                'img'               => 'https://api.dicebear.com/9.x/lorelei/svg?seed=Felix',
                'firstname'         => 'Miguel',
                'lastname'          => 'Pérez Gutiérrez',
                'address'           => 'Calle Mayor 12, Alhaurin de la Torre',
                'postalCode'        => '29130',
                'email'             => 'miguel@gmail.com',
                'email_verified_at' => now(),
                'password'          => Hash::make('123123'),
            ],
            [
                'dni'               => '87654321B',
                'username'          => 'phantom_seeker',
                'img'               => 'https://api.dicebear.com/9.x/lorelei/svg?seed=Luna',
                'firstname'         => 'Laura',
                'lastname'          => 'García Sánchez',
                'address'           => 'Avenida Diagonal 45, Barcelona',
                'postalCode'        => '08005',
                'email'             => 'laura.garcia@example.com',
                'email_verified_at' => now(),
                'password'          => Hash::make('password123'),
            ],
            [
                'dni'               => '11223344C',
                'username'          => 'spirit_watcher',
                'img'               => 'https://api.dicebear.com/9.x/lorelei/svg?seed=Shadow',
                'firstname'         => 'Miguel',
                'lastname'          => 'Fernández Ruiz',
                'address'           => 'Calle San Fernando 8, Sevilla',
                'postalCode'        => '41003',
                'email'             => 'miguel.fernandez@example.com',
                'email_verified_at' => now(),
                'password'          => Hash::make('password123'),
            ],
            [
                'dni'               => '55667788D',
                'username'          => 'dark_explorer',
                'img'               => 'https://api.dicebear.com/9.x/lorelei/svg?seed=Raven',
                'firstname'         => 'Ana',
                'lastname'          => 'Pérez Torres',
                'address'           => 'Calle Larios 3, Málaga',
                'postalCode'        => '29005',
                'email'             => 'ana.perez@example.com',
                'email_verified_at' => now(),
                'password'          => Hash::make('password123'),
            ],
            [
                'dni'               => '99887766E',
                'username'          => 'night_chaser',
                'img'               => 'https://api.dicebear.com/9.x/lorelei/svg?seed=Storm',
                'firstname'         => 'David',
                'lastname'          => 'López Jiménez',
                'address'           => 'Gran Vía 20, Bilbao',
                'postalCode'        => '48001',
                'email'             => 'david.lopez@example.com',
                'email_verified_at' => now(),
                'password'          => Hash::make('password123'),
            ],
        ];

        foreach ($users as $data) {
            User::create($data);
        }
    }
}