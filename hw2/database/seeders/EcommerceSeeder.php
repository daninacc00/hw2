<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EcommerceSeeder extends Seeder
{
    public function run(): void
    {
        // Categories
        DB::table('categories')->insert([
            ['name' => 'men', 'slug' => 'men', 'display_name' => 'Uomo'],
            ['name' => 'women', 'slug' => 'women', 'display_name' => 'Donna'],
            ['name' => 'kids', 'slug' => 'kids', 'display_name' => 'Bambini']
        ]);

        // Sections
        DB::table('sections')->insert([
            ['name' => 'shoes', 'slug' => 'shoes', 'display_name' => 'Sneakers e scarpe'],
            ['name' => 'clothing', 'slug' => 'clothing', 'display_name' => 'Abbigliamento'],
            ['name' => 'accessories', 'slug' => 'accessories', 'display_name' => 'Accessori']
        ]);

        // Sports
        DB::table('sports')->insert([
            ['name' => 'lifestyle', 'slug' => 'lifestyle', 'display_name' => 'Lifestyle'],
            ['name' => 'jordan', 'slug' => 'jordan', 'display_name' => 'Jordan'],
            ['name' => 'running', 'slug' => 'running', 'display_name' => 'Running'],
            ['name' => 'basketball', 'slug' => 'basketball', 'display_name' => 'Basketball'],
            ['name' => 'football', 'slug' => 'football', 'display_name' => 'Calcio'],
            ['name' => 'training', 'slug' => 'training', 'display_name' => 'Allenamento e palestra'],
            ['name' => 'skateboard', 'slug' => 'skateboard', 'display_name' => 'Skateboard'],
            ['name' => 'golf', 'slug' => 'golf', 'display_name' => 'Golf'],
            ['name' => 'tennis', 'slug' => 'tennis', 'display_name' => 'Tennis'],
            ['name' => 'walking', 'slug' => 'walking', 'display_name' => 'Camminata']
        ]);

        // Colors
        DB::table('colors')->insert([
            ['name' => 'Nero', 'hex_code' => '#000000'],
            ['name' => 'Bianco', 'hex_code' => '#FFFFFF'],
            ['name' => 'Grigio', 'hex_code' => '#808080'],
            ['name' => 'Rosso', 'hex_code' => '#FF0000'],
            ['name' => 'Blu', 'hex_code' => '#0000FF'],
            ['name' => 'Verde', 'hex_code' => '#008000'],
            ['name' => 'Giallo', 'hex_code' => '#FFFF00'],
            ['name' => 'Arancione', 'hex_code' => '#FFA500'],
            ['name' => 'Rosa', 'hex_code' => '#FFC0CB'],
            ['name' => 'Viola', 'hex_code' => '#800080'],
            ['name' => 'Marrone', 'hex_code' => '#A52A2A'],
            ['name' => 'Beige', 'hex_code' => '#F5F5DC']
        ]);

        // Sizes - Scarpe
        $shoeSizes = [
            ['value' => '35', 'type' => 0, 'sort_order' => 1],
            ['value' => '35.5', 'type' => 0, 'sort_order' => 2],
            ['value' => '36', 'type' => 0, 'sort_order' => 3],
            ['value' => '36.5', 'type' => 0, 'sort_order' => 4],
            ['value' => '37', 'type' => 0, 'sort_order' => 5],
            ['value' => '37.5', 'type' => 0, 'sort_order' => 6],
            ['value' => '38', 'type' => 0, 'sort_order' => 7],
            ['value' => '38.5', 'type' => 0, 'sort_order' => 8],
            ['value' => '39', 'type' => 0, 'sort_order' => 9],
            ['value' => '39.5', 'type' => 0, 'sort_order' => 10],
            ['value' => '40', 'type' => 0, 'sort_order' => 11],
            ['value' => '40.5', 'type' => 0, 'sort_order' => 12],
            ['value' => '41', 'type' => 0, 'sort_order' => 13],
            ['value' => '41.5', 'type' => 0, 'sort_order' => 14],
            ['value' => '42', 'type' => 0, 'sort_order' => 15],
            ['value' => '42.5', 'type' => 0, 'sort_order' => 16],
            ['value' => '43', 'type' => 0, 'sort_order' => 17],
            ['value' => '43.5', 'type' => 0, 'sort_order' => 18],
            ['value' => '44', 'type' => 0, 'sort_order' => 19],
            ['value' => '44.5', 'type' => 0, 'sort_order' => 20],
            ['value' => '45', 'type' => 0, 'sort_order' => 21],
            ['value' => '45.5', 'type' => 0, 'sort_order' => 22],
            ['value' => '46', 'type' => 0, 'sort_order' => 23],
            ['value' => '47', 'type' => 0, 'sort_order' => 24],
            ['value' => '47.5', 'type' => 0, 'sort_order' => 25],
            ['value' => '48', 'type' => 0, 'sort_order' => 26],
            ['value' => '48.5', 'type' => 0, 'sort_order' => 27],
            ['value' => '49', 'type' => 0, 'sort_order' => 28]
        ];
        
        // Sizes - Abbigliamento
        $clothingSizes = [
            ['value' => 'XS', 'type' => 1, 'sort_order' => 1],
            ['value' => 'S', 'type' => 1, 'sort_order' => 2],
            ['value' => 'M', 'type' => 1, 'sort_order' => 3],
            ['value' => 'L', 'type' => 1, 'sort_order' => 4],
            ['value' => 'XL', 'type' => 1, 'sort_order' => 5],
            ['value' => 'XXL', 'type' => 1, 'sort_order' => 6],
            ['value' => 'XXXL', 'type' => 1, 'sort_order' => 7]
        ];

        DB::table('sizes')->insert(array_merge($shoeSizes, $clothingSizes));

        // Products
        DB::table('products')->insert([
            [
                'id' => 1,
                'name' => 'Air Jordan 1 Retro Low Quai 54',
                'slug' => 'air-jordan-1-retro-low-quai-54',
                'description' => 'Cercando la giusta ispirazione per creare la collezione di quest\'anno, il nostro team di design voleva qualcosa che incarnasse competizione, community e creatività, proprio come il torneo Quai 54. La pista ci ha dato la risposta che volevamo. Ispirata agli sport motoristici francesi, questa AJ1 rétro mescola i classici colori delle gare su circuito con l\'iconico stile Jordan.',
                'short_description' => 'Sneakers classiche stile air jordan',
                'price' => 139.99,
                'original_price' => null,
                'discount_percentage' => 0,
                'category_id' => 1,
                'section_id' => 1,
                'sport_id' => 1,
                'gender' => 0,
                'shoe_height' => 0,
                'is_bestseller' => true,
                'is_new_arrival' => false,
                'is_on_sale' => false,
                'stock_quantity' => 50,
                'rating' => 4.50,
                'rating_count' => 1245,
                'status' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'name' => 'Luka .77 Quai 54',
                'slug' => 'luka-.77-quai-54',
                'description' => 'Pensata per essere inarrestabile come il gioco di Luka, questa Luka .77 celebra il torneo Quai 54 con una scarpa realizzata per resistere sui campi outdoor accidentati dove i giocatori costruiscono la loro leggenda. Il mesh antiabrasione e il battistrada in gomma a tutta lunghezza sono a prova di cemento e asfalto. L\'unità Air Zoom e la schiuma reattiva a doppia densità offrono un comfort ideale su qualsiasi campo. Il più grande torneo di streetball del mondo ti sta aspettando. Cosa pensi di fare?',
                'short_description' => 'Sneakers con suola ammortizzata',
                'price' => 99.99,
                'original_price' => 129.00,
                'discount_percentage' => 22,
                'category_id' => 1,
                'section_id' => 1,
                'sport_id' => 1,
                'gender' => 0,
                'shoe_height' => 0,
                'is_bestseller' => true,
                'is_new_arrival' => false,
                'is_on_sale' => false,
                'stock_quantity' => 75,
                'rating' => 4.70,
                'rating_count' => 2156,
                'status' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 3,
                'name' => 'Nike Pegasus Premium',
                'slug' => 'nike-pegasus-premium',
                'description' => 'Pegasus Premium potenzia l\'ammortizzazione reattiva con un triplo strato delle nostre più potenti tecnologie per il running: schiuma ZoomX, unità Air Zoom sagomata e schiuma ReactX. La Pegasus più reattiva di sempre offre un ritorno di energia senza precedenti. Con una tomaia più leggera dell\'aria, riduce il peso e aumenta la traspirabilità per farti volare ancora più velocemente.',
                'short_description' => 'Scarpe running con suola ammortizzata',
                'price' => 209.00,
                'original_price' => null,
                'discount_percentage' => 0,
                'category_id' => 1,
                'section_id' => 1,
                'sport_id' => 1,
                'gender' => 0,
                'shoe_height' => 0,
                'is_bestseller' => false,
                'is_new_arrival' => true,
                'is_on_sale' => false,
                'stock_quantity' => 30,
                'rating' => 4.20,
                'rating_count' => 856,
                'status' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 4,
                'name' => 'Air Jordan 1 Retro Low',
                'slug' => 'air-jordan-1-retro-low',
                'description' => 'Effetto ghiaccio e menta. Con una tomaia in suede tono su tono, AJ Low "Washed Teal" dona una ventata di freschezza alla silhouette originale dell\'85. Fedeli alla tradizione, il brand Nike Air e il logo Wings esclusivo impreziosiscono rispettivamente la linguetta e il tallone. Una suola tinta Igloo dona il tocco finale al look.',
                'short_description' => 'Sneaker classica ghiaccio e menta',
                'price' => 159.00,
                'original_price' => null,
                'discount_percentage' => 0,
                'category_id' => 1,
                'section_id' => 1,
                'sport_id' => 1,
                'gender' => 0,
                'shoe_height' => null,
                'is_bestseller' => false,
                'is_new_arrival' => false,
                'is_on_sale' => false,
                'stock_quantity' => 100,
                'rating' => 4.30,
                'rating_count' => 645,
                'status' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 5,
                'name' => 'Nike Air Max 95 Recraft',
                'slug' => 'nike-air-max-95-recraft',
                'description' => 'Questa Nike Air Max 95 Recraft riporta alla luce un tesoro del passato per celebrare il 30° anniversario dell\'originale. Abbiamo ovviamente mantenuto l\'ammortizzazione Max Air, la resistente pelle scamosciata e le iconiche linee di design che fecero girare la testa a molti nel 1995 per regalare un classico istantaneo al tuo piccolo.',
                'short_description' => 'Sneaker bambino',
                'price' => 99.00,
                'original_price' => 109.00,
                'discount_percentage' => 19,
                'category_id' => 1,
                'section_id' => 1,
                'sport_id' => 1,
                'gender' => 0,
                'shoe_height' => null,
                'is_bestseller' => false,
                'is_new_arrival' => true,
                'is_on_sale' => true,
                'stock_quantity' => 25,
                'rating' => 4.40,
                'rating_count' => 423,
                'status' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);

        // Product Images
        DB::table('product_images')->insert([
            ['product_id' => 1, 'image_url' => '/assets/images/products/air-jordan-1-retro-low-quai-54.avif', 'alt_text' => 'Air Jordan 1 Retro Low Quai 54 - Vista principale', 'is_primary' => true, 'sort_order' => 1],
            ['product_id' => 1, 'image_url' => '/assets/images/products/air-jordan-1-retro-low-quai-54-top.png', 'alt_text' => 'Air Jordan 1 Retro Low Quai 54 - Vista da sopra', 'is_primary' => false, 'sort_order' => 2],
            ['product_id' => 1, 'image_url' => '/assets/images/products/air-jordan-1-retro-low-quai-54-side.png', 'alt_text' => 'Air Jordan 1 Retro Low Quai 54 - Vista laterale', 'is_primary' => false, 'sort_order' => 3],
            ['product_id' => 2, 'image_url' => '/assets/images/products/luka-.77-quai-54.avif', 'alt_text' => 'Luka .77 Quai 54 - Vista principale', 'is_primary' => true, 'sort_order' => 1],
            ['product_id' => 2, 'image_url' => '/assets/images/products/luka-.77-quai-54-side.avif', 'alt_text' => 'Luka .77 Quai 54 - Vista laterale', 'is_primary' => false, 'sort_order' => 2],
            ['product_id' => 3, 'image_url' => '/assets/images/products/nike-pegasus-premium.avif', 'alt_text' => 'Nike Pegasus Premium - Vista principale', 'is_primary' => true, 'sort_order' => 1],
            ['product_id' => 4, 'image_url' => '/assets/images/products/air-jordan-1-retro-low.avif', 'alt_text' => 'Air Jordan 1 Retro Low', 'is_primary' => true, 'sort_order' => 1],
            ['product_id' => 5, 'image_url' => '/assets/images/products/nike-air-max-95-recraft.avif', 'alt_text' => 'Nike Air Max 95 Recraft', 'is_primary' => true, 'sort_order' => 1]
        ]);

        // Product Colors
        DB::table('product_colors')->insert([
            ['product_id' => 1, 'color_id' => 1], ['product_id' => 1, 'color_id' => 2], ['product_id' => 1, 'color_id' => 3], ['product_id' => 1, 'color_id' => 4], ['product_id' => 1, 'color_id' => 5],
            ['product_id' => 2, 'color_id' => 2], ['product_id' => 2, 'color_id' => 1], ['product_id' => 2, 'color_id' => 4],
            ['product_id' => 3, 'color_id' => 1], ['product_id' => 3, 'color_id' => 2], ['product_id' => 3, 'color_id' => 5], ['product_id' => 3, 'color_id' => 6],
            ['product_id' => 4, 'color_id' => 1], ['product_id' => 4, 'color_id' => 2], ['product_id' => 4, 'color_id' => 4], ['product_id' => 4, 'color_id' => 5], ['product_id' => 4, 'color_id' => 6], ['product_id' => 4, 'color_id' => 7],
            ['product_id' => 5, 'color_id' => 1], ['product_id' => 5, 'color_id' => 3], ['product_id' => 5, 'color_id' => 5]
        ]);

        // Product Sizes per scarpe
        DB::table('product_sizes')->insert([
            ['product_id' => 1, 'size_id' => 11, 'stock_quantity' => 5],
            ['product_id' => 1, 'size_id' => 13, 'stock_quantity' => 8],
            ['product_id' => 1, 'size_id' => 15, 'stock_quantity' => 12],
            ['product_id' => 1, 'size_id' => 17, 'stock_quantity' => 10],
            ['product_id' => 1, 'size_id' => 19, 'stock_quantity' => 7],
            ['product_id' => 1, 'size_id' => 21, 'stock_quantity' => 8],
            ['product_id' => 2, 'size_id' => 11, 'stock_quantity' => 10],
            ['product_id' => 2, 'size_id' => 13, 'stock_quantity' => 15],
            ['product_id' => 2, 'size_id' => 15, 'stock_quantity' => 20],
            ['product_id' => 2, 'size_id' => 17, 'stock_quantity' => 18],
            ['product_id' => 2, 'size_id' => 19, 'stock_quantity' => 12],
            ['product_id' => 2, 'size_id' => 21, 'stock_quantity' => 0],
            ['product_id' => 3, 'size_id' => 11, 'stock_quantity' => 3],
            ['product_id' => 3, 'size_id' => 13, 'stock_quantity' => 8],
            ['product_id' => 3, 'size_id' => 15, 'stock_quantity' => 10],
            ['product_id' => 3, 'size_id' => 17, 'stock_quantity' => 5],
            ['product_id' => 3, 'size_id' => 19, 'stock_quantity' => 4],
            ['product_id' => 4, 'size_id' => 29, 'stock_quantity' => 15],
            ['product_id' => 4, 'size_id' => 30, 'stock_quantity' => 25],
            ['product_id' => 4, 'size_id' => 31, 'stock_quantity' => 30],
            ['product_id' => 4, 'size_id' => 32, 'stock_quantity' => 20],
            ['product_id' => 4, 'size_id' => 33, 'stock_quantity' => 10],
            ['product_id' => 5, 'size_id' => 29, 'stock_quantity' => 5],
            ['product_id' => 5, 'size_id' => 30, 'stock_quantity' => 8],
            ['product_id' => 5, 'size_id' => 31, 'stock_quantity' => 12],
            ['product_id' => 5, 'size_id' => 32, 'stock_quantity' => 7],
            ['product_id' => 5, 'size_id' => 33, 'stock_quantity' => 3]
        ]);
    }
}