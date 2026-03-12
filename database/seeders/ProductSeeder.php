<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'id'          => Str::uuid(),
                'sku'         => '8410000001234',
                'title'       => 'Detector EMF K2 Pro',
                'provider'    => 'GhostTech Industries',
                'price'       => 49.99,
                'tax'         => 21,
                'stock'       => 25,
                'image'       => 'https://example.com/images/products/emf-k2-pro.jpg',
                'description' => 'Detector de campos electromagnéticos profesional con 5 niveles de sensibilidad LED. Imprescindible en toda investigación paranormal.',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => Str::uuid(),
                'sku'         => '8410000002345',
                'title'       => 'Grabadora EVP Digital 32GB',
                'provider'    => 'SpiritSound Labs',
                'price'       => 89.95,
                'tax'         => 21,
                'stock'       => 15,
                'image'       => 'https://example.com/images/products/grabadora-evp.jpg',
                'description' => 'Grabadora de voz de alta sensibilidad con filtro de frecuencias espectrales. Captura voces electrónicas de fenómenos paranormales con 32GB de almacenamiento interno.',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => Str::uuid(),
                'sku'         => '8410000003456',
                'title'       => 'Cámara Térmica Nocturna',
                'provider'    => 'NightVision Corp',
                'price'       => 349.00,
                'tax'         => 21,
                'stock'       => 8,
                'image'       => 'https://example.com/images/products/camara-termica.jpg',
                'description' => 'Cámara de visión nocturna con sensor térmico de alta resolución. Detecta variaciones de temperatura de hasta 0.05°C. Ideal para documentar presencias espectrales.',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => Str::uuid(),
                'sku'         => '8410000004567',
                'title'       => 'SpiritBox PSB-7',
                'provider'    => 'GhostTech Industries',
                'price'       => 64.50,
                'tax'         => 21,
                'stock'       => 20,
                'image'       => 'https://example.com/images/products/spiritbox-psb7.jpg',
                'description' => 'Caja de espíritus con barrido de frecuencias AM/FM. Permite la comunicación en tiempo real con entidades. Incluye auriculares y cable de audio.',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => Str::uuid(),
                'sku'         => '8410000005678',
                'title'       => 'Kit de Investigación Completo',
                'provider'    => 'ParaEquip España',
                'price'       => 199.99,
                'tax'         => 21,
                'stock'       => 5,
                'image'       => 'https://example.com/images/products/kit-investigacion.jpg',
                'description' => 'Kit completo para investigadores paranormales. Incluye detector EMF, grabadora digital, termómetro láser, linterna UV y maletín de transporte resistente.',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => Str::uuid(),
                'sku'         => '8410000006789',
                'title'       => 'Termómetro Láser Infrarrojo',
                'provider'    => 'SpiritSound Labs',
                'price'       => 29.95,
                'tax'         => 21,
                'stock'       => 40,
                'image'       => 'https://example.com/images/products/termometro-laser.jpg',
                'description' => 'Termómetro de precisión con puntero láser. Mide temperaturas entre -50°C y 380°C. Imprescindible para detectar puntos fríos asociados a actividad paranormal.',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ];

        DB::table('products')->insert($products);
    }
}