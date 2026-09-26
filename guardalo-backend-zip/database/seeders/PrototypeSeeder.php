<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Box;
use App\Models\Operation;
use App\Models\Price;
use App\Models\ContractTemplate;

class PrototypeSeeder extends Seeder
{
    /**
     * Run the database seeds matching the prototype mockup.
     *
     * @return void
     */
    public function run()
    {
        // 1. Usuarios Demo
        $admin = User::firstOrCreate(
            ['email' => 'juan@guardalo.com.ar'],
            [
                'name' => 'Juan López',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '02346 15-55-1234',
                'dni' => '32.456.789',
                'address' => 'Av. Mitre 450, Chivilcoy',
                'city' => 'Chivilcoy',
            ]
        );

        $client = User::firstOrCreate(
            ['email' => 'juan.lopez@ejemplo.com'],
            [
                'name' => 'Juan López',
                'password' => Hash::make('password'),
                'role' => 'cliente',
                'phone' => '02346 15-55-1234',
                'dni' => '32.456.789',
                'address' => 'Av. Mitre 450, Chivilcoy',
                'city' => 'Chivilcoy',
            ]
        );

        $client2 = User::firstOrCreate(
            ['email' => 'maria.g@ejemplo.com'],
            [
                'name' => 'María González',
                'password' => Hash::make('password'),
                'role' => 'cliente',
                'phone' => '02346 15-44-9988',
                'dni' => '28.123.456',
                'address' => 'Pellegrini 320, Chivilcoy',
                'city' => 'Chivilcoy',
            ]
        );

        // 2. Boxes (Prototipo Pág. 2)
        $box16 = Box::firstOrCreate(
            ['box_number' => 'BOX 16'],
            [
                'size' => 'Mediano',
                'dimensions' => '13.75m² (2.75x5m)',
                'status' => 'alquilado',
                'base_price' => 13500.00,
            ]
        );

        $box17 = Box::firstOrCreate(
            ['box_number' => 'BOX 17'],
            [
                'size' => 'Pequeño',
                'dimensions' => '8.3m² (1.66x5m)',
                'status' => 'alquilado',
                'base_price' => 9800.00,
            ]
        );

        $box18 = Box::firstOrCreate(
            ['box_number' => 'BOX 18'],
            [
                'size' => 'Grande',
                'dimensions' => '20.5m² (4.10x5m)',
                'status' => 'disponible',
                'base_price' => 20500.00,
            ]
        );

        $box04 = Box::firstOrCreate(
            ['box_number' => 'BOX 04'],
            [
                'size' => 'Pequeño',
                'dimensions' => '8.3m² (1.66x5m)',
                'status' => 'alquilado',
                'base_price' => 9800.00,
            ]
        );

        // 3. Operaciones / Alquileres (Prototipo Pág. 2: "Hasta el 22 de diciembre")
        Operation::firstOrCreate(
            ['operation_code' => '#OP-9482'],
            [
                'user_id' => $client->id,
                'box_id' => $box16->id,
                'start_date' => '2026-09-22',
                'end_date' => '2026-12-22', // "Hasta el 22 de diciembre"
                'amount' => 13500.00,
                'payment_status' => 'pagado',
                'payment_method' => 'mercadopago',
                'notes' => 'Alquiler renovado con tarifa promocional trimestral',
            ]
        );

        Operation::firstOrCreate(
            ['operation_code' => '#OP-8921'],
            [
                'user_id' => $client->id,
                'box_id' => $box17->id,
                'start_date' => '2026-09-22',
                'end_date' => '2026-12-22', // "Hasta el 22 de diciembre"
                'amount' => 9800.00,
                'payment_status' => 'pagado',
                'payment_method' => 'transferencia',
                'notes' => 'Alquiler de box individual',
            ]
        );

        Operation::firstOrCreate(
            ['operation_code' => '#OP-7301'],
            [
                'user_id' => $client2->id,
                'box_id' => $box04->id,
                'start_date' => '2026-09-01',
                'end_date' => '2026-11-01',
                'amount' => 9800.00,
                'payment_status' => 'pagado',
                'payment_method' => 'mercadopago',
            ]
        );

        // 4. Precios Oficiales (21 Tarifas Homologadas)
        $pricesData = [
            // Mediano (13.75m²)
            ['period' => '1 DÍA', 'amount' => 6000, 'promo_text' => null, 'size_category' => 'Mediano (13.75m²)', 'sort_order' => 1],
            ['period' => '3 DÍAS', 'amount' => 10000, 'promo_text' => null, 'size_category' => 'Mediano (13.75m²)', 'sort_order' => 2],
            ['period' => '7 DÍAS', 'amount' => 22500, 'promo_text' => null, 'size_category' => 'Mediano (13.75m²)', 'sort_order' => 3],
            ['period' => '15 DÍAS', 'amount' => 26250, 'promo_text' => null, 'size_category' => 'Mediano (13.75m²)', 'sort_order' => 4],
            ['period' => '30 DÍAS', 'amount' => 60000, 'promo_text' => null, 'size_category' => 'Mediano (13.75m²)', 'sort_order' => 5],
            ['period' => '90 DÍAS', 'amount' => 180000, 'promo_text' => 'promo +10 días', 'size_category' => 'Mediano (13.75m²)', 'sort_order' => 6],
            ['period' => '180 DÍAS', 'amount' => 360000, 'promo_text' => 'promo +30 días', 'size_category' => 'Mediano (13.75m²)', 'sort_order' => 7],

            // Pequeño (8.3m²)
            ['period' => '1 DÍA', 'amount' => 3650, 'promo_text' => null, 'size_category' => 'Pequeño (8.3m²)', 'sort_order' => 11],
            ['period' => '3 DÍAS', 'amount' => 6090, 'promo_text' => null, 'size_category' => 'Pequeño (8.3m²)', 'sort_order' => 12],
            ['period' => '7 DÍAS', 'amount' => 13700, 'promo_text' => null, 'size_category' => 'Pequeño (8.3m²)', 'sort_order' => 13],
            ['period' => '15 DÍAS', 'amount' => 22850, 'promo_text' => null, 'size_category' => 'Pequeño (8.3m²)', 'sort_order' => 14],
            ['period' => '30 DÍAS', 'amount' => 36500, 'promo_text' => null, 'size_category' => 'Pequeño (8.3m²)', 'sort_order' => 15],
            ['period' => '90 DÍAS', 'amount' => 109500, 'promo_text' => 'promo +10 días', 'size_category' => 'Pequeño (8.3m²)', 'sort_order' => 16],
            ['period' => '180 DÍAS', 'amount' => 219000, 'promo_text' => 'promo +30 días', 'size_category' => 'Pequeño (8.3m²)', 'sort_order' => 17],

            // Grande (20.5m²)
            ['period' => '1 DÍA', 'amount' => 9000, 'promo_text' => null, 'size_category' => 'Grande (20.5m²)', 'sort_order' => 21],
            ['period' => '3 DÍAS', 'amount' => 15000, 'promo_text' => null, 'size_category' => 'Grande (20.5m²)', 'sort_order' => 22],
            ['period' => '7 DÍAS', 'amount' => 33750, 'promo_text' => null, 'size_category' => 'Grande (20.5m²)', 'sort_order' => 23],
            ['period' => '15 DÍAS', 'amount' => 56250, 'promo_text' => null, 'size_category' => 'Grande (20.5m²)', 'sort_order' => 24],
            ['period' => '30 DÍAS', 'amount' => 90000, 'promo_text' => null, 'size_category' => 'Grande (20.5m²)', 'sort_order' => 25],
            ['period' => '90 DÍAS', 'amount' => 270000, 'promo_text' => 'promo +10 días', 'size_category' => 'Grande (20.5m²)', 'sort_order' => 26],
            ['period' => '180 DÍAS', 'amount' => 540000, 'promo_text' => 'promo +30 días', 'size_category' => 'Grande (20.5m²)', 'sort_order' => 27],
        ];

        foreach ($pricesData as $p) {
            Price::updateOrCreate(
                [
                    'period' => $p['period'],
                    'size_category' => $p['size_category'],
                ],
                [
                    'amount' => $p['amount'],
                    'promo_text' => $p['promo_text'],
                    'sort_order' => $p['sort_order'],
                    'is_active' => true,
                ]
            );
        }

        // 5. Plantilla de Contrato (Prototipo sidebar: CONTRATO)
        ContractTemplate::updateOrCreate(
            ['version' => '1.0'],
            [
                'title' => 'Contrato de Locación de Espacio de Almacenaje',
                'content' => "CONTRATO DE LOCACIÓN DE ESPACIO DE ALMACENAJE (BOX)\n\nEntre GUARDALO.COM (\"La Locadora\") y el CLIENTE (\"El Locatario\"):\nPRIMERA: El Locatario alquila el espacio individual determinado asignado para almacenamiento temporal de enseres y mercadería no peligrosa.\nSEGUNDA: El pago se efectuará por período anticipado. El vencimiento operará de pleno derecho al término del período contratado.\nTERCERA: Queda prohibido el almacenamiento de sustancias inflamables, tóxicas, ilegales o perecederas.",
                'is_active' => true,
            ]
        );
    }
}
