<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
final class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $products = [
            ['sku' => 'EQ-EMF-K2', 'name' => 'Detector EMF K2 Pro', 'price' => 49.99, 'category' => 'EQUIPMENT', 'image' => 'emf_k2.jpg', 'desc' => 'Detector de campos electromagnéticos con 5 niveles de sensibilidad.'],
            ['sku' => 'EQ-EVP-DIG', 'name' => 'Grabadora EVP Digital', 'price' => 89.95, 'category' => 'EQUIPMENT', 'image' => 'evp_recorder.jpg', 'desc' => 'Captura voces electrónicas con máxima nitidez.'],
            ['sku' => 'EQ-CAM-THERM', 'name' => 'Cámara Térmica FLIR', 'price' => 349.00, 'category' => 'EQUIPMENT', 'image' => 'thermal_cam.jpg', 'desc' => 'Visualiza variaciones térmicas de hasta 0.05°C.'],
            ['sku' => 'EQ-SB-PSB7', 'name' => 'SpiritBox PSB-7', 'price' => 64.50, 'category' => 'EQUIPMENT', 'image' => 'ghost_box_bt.jpg', 'desc' => 'Radio de barrido para comunicación en tiempo real.'],
            ['sku' => 'EQ-SALT-VAT', 'name' => 'Sal Bendita Consagrada', 'price' => 15.00, 'category' => 'PROTECTION', 'image' => 'salt.jpg', 'desc' => 'Sal marina pura ritualizada para protección.'],
            ['sku' => 'EQ-DOTS-PRO', 'name' => 'Proyector D.O.T.S.', 'price' => 120.00, 'category' => 'EQUIPMENT', 'image' => 'dots.jpg', 'desc' => 'Matriz láser para detectar siluetas invisibles.'],
            ['sku' => 'EQ-CROSS-SILV', 'name' => 'Crucifijo de Plata', 'price' => 35.00, 'category' => 'PROTECTION', 'image' => 'cross.jpg', 'desc' => 'Reliquia de protección personal de plata de ley.'],
            ['sku' => 'EQ-INC-PUR', 'name' => 'Inciensos Purificadores', 'price' => 10.50, 'category' => 'CONSUMABLE', 'image' => 'smudge.jpg', 'desc' => 'Pack de varillas para limpieza energética.'],
            ['sku' => 'EQ-UV-LIGHT', 'name' => 'Linterna UV Potente', 'price' => 22.00, 'category' => 'EQUIPMENT', 'image' => 'uv_light.jpg', 'desc' => 'Revela rastros de ectoplasma y huellas invisibles.'],
            ['sku' => 'EQ-PILL-SANITY', 'name' => 'Píldoras de Cordura', 'price' => 45.00, 'category' => 'CONSUMABLE', 'image' => 'pills.jpg', 'desc' => 'Restaurador mental para situaciones de pánico.'],
            ['sku' => 'EQ-FLASH-PRO', 'name' => 'Linterna Profesional P3', 'price' => 120.00, 'category' => 'EQUIPMENT', 'image' => 'flashlight_p3.jpg', 'desc' => 'Iluminación de alto alcance para grandes estancias.'],
            ['sku' => 'EQ-MOTION-IR', 'name' => 'Sensor Movimiento IR', 'price' => 75.00, 'category' => 'EQUIPMENT', 'image' => 'motion_ir.jpg', 'desc' => 'Detecta cambios térmicos en movimiento.'],
            ['sku' => 'EQ-SOUND-AMP', 'name' => 'Amplificador Parabólico', 'price' => 180.00, 'category' => 'EQUIPMENT', 'image' => 'sound_amp.jpg', 'desc' => 'Captura sonidos lejanos con gran amplificación.'],
            ['sku' => 'EQ-OUIJA-BOARD', 'name' => 'Tablero Ouija Roble', 'price' => 110.00, 'category' => 'CURSED', 'image' => 'ouija.jpg', 'desc' => 'Tablero tallado a mano con puntero equilibrado.'],
            ['sku' => 'EQ-GHOST-NET', 'name' => 'Red de Captura Ecto', 'price' => 150.00, 'category' => 'EQUIPMENT', 'image' => 'ghost_net.jpg', 'desc' => 'Malla ionizada para retención espectral.'],
            ['sku' => 'EQ-HOLY-WATER', 'name' => 'Agua Bendita Ampolla', 'price' => 18.00, 'category' => 'CONSUMABLE', 'image' => 'holy_water.jpg', 'desc' => 'Agua bendecida en santuario sagrado.'],
            ['sku' => 'EQ-TAROT-CURSED', 'name' => 'Tarot Siglo XVIII', 'price' => 85.00, 'category' => 'CURSED', 'image' => 'tarot.jpg', 'desc' => 'Baraja antigua con alta carga energética.'],
            ['sku' => 'EQ-SALT-GUN', 'name' => 'Lanzador de Sal Pro', 'price' => 195.00, 'category' => 'EQUIPMENT', 'image' => 'salt_gun.jpg', 'desc' => 'Dispersión rápida de sal para defensa.'],
            ['sku' => 'EQ-ECTO-TRAP', 'name' => 'Trampa de Vacío Ecto', 'price' => 250.00, 'category' => 'EQUIPMENT', 'image' => 'ecto_trap.jpg', 'desc' => 'Contenedor hermético para muestras físicas.'],
            ['sku' => 'EQ-GHOST-WATCH', 'name' => 'Reloj Detector EMF', 'price' => 95.00, 'category' => 'EQUIPMENT', 'image' => 'watch_emf.jpg', 'desc' => 'Reloj de pulsera con alerta vibratoria EMF.'],
            ['sku' => 'EQ-CANDLES-BLK', 'name' => 'Velas Negras Pack', 'price' => 15.00, 'category' => 'CONSUMABLE', 'image' => 'candles.jpg', 'desc' => 'Velas de cera pura para rituales.'],
            ['sku' => 'EQ-SAGE-WHITE', 'name' => 'Salvia Blanca Atado', 'price' => 12.00, 'category' => 'CONSUMABLE', 'image' => 'sage.jpg', 'desc' => 'Para limpiezas energéticas de ambientes.'],
            ['sku' => 'EQ-TERM-LSR', 'name' => 'Termómetro Láser', 'price' => 65.00, 'category' => 'EQUIPMENT', 'image' => 'thermometer.jpg', 'desc' => 'Medición instantánea de puntos fríos.'],
            ['sku' => 'EQ-TRIPOD-STB', 'name' => 'Trípode Estabilizador', 'price' => 55.00, 'category' => 'EQUIPMENT', 'image' => 'tripod.jpg', 'desc' => 'Base sólida para cámaras y sensores.'],
            ['sku' => 'EQ-LENS-UV', 'name' => 'Filtro Lente UV', 'price' => 30.00, 'category' => 'EQUIPMENT', 'image' => 'uv_filter.jpg', 'desc' => 'Mejora la captura de orbes en fotografía.'],
            ['sku' => 'EQ-VEST-PROT', 'name' => 'Chaleco de Kevlar', 'price' => 320.00, 'category' => 'PROTECTION', 'image' => 'vest.jpg', 'desc' => 'Protección física contra poltergeist.'],
            ['sku' => 'EQ-HEADLIGHT', 'name' => 'Frontal LED Minero', 'price' => 40.00, 'category' => 'EQUIPMENT', 'image' => 'headlight.jpg', 'desc' => 'Manos libres con iluminación potente.'],
            ['sku' => 'EQ-GHOST-BOOK', 'name' => 'Libro Escritura Auto', 'price' => 35.00, 'category' => 'CURSED', 'image' => 'ghost_book.jpg', 'desc' => 'Facilita la comunicación mediante escritura.'],
            ['sku' => 'EQ-GLOWSTICKS', 'name' => 'Barras UV Pack 10', 'price' => 25.00, 'category' => 'CONSUMABLE', 'image' => 'glowsticks.jpg', 'desc' => 'Marcadores de ruta en oscuridad total.'],
            ['sku' => 'EQ-PARAB-MIC', 'name' => 'Micrófono Parabólico II', 'price' => 210.00, 'category' => 'EQUIPMENT', 'image' => 'parabolic_mic.jpg', 'desc' => 'Versión avanzada con filtrado digital.'],
        ];

        $product = $this->faker->unique()->randomElement($products);

        return [
            'id' => (string) Str::uuid(),
            'sku' => $product['sku'],
            'title' => $product['name'],
            'provider' => $this->faker->randomElement(['Arcane Industries', 'Specter Tech', 'Vatican Supplies', 'GhostGear Pro']),
            'price' => $product['price'],
            'tax' => 21,
            'stock' => $this->faker->numberBetween(5, 50),
            'category' => $product['category'],
            'description' => $product['desc'],
            'image' => 'images/products/'.$product['image'],
        ];
    }
}
