<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SliderImage;
use Carbon\Carbon;

class SliderImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pulisce la tabella prima di inserire i dati
        SliderImage::truncate();

        $sliderImages = [
            [
                'id' => 1,
                'src' => 'assets/images/landingpage/slider/scarpa1.png',
                'alt_text' => 'Air Max',
                'name' => 'Air Max',
                'is_free_shipping' => true,
                'is_active' => true,
                'order_index' => 1,
                'created_at' => '2025-05-18 13:24:43',
                'updated_at' => '2025-05-18 13:24:43'
            ],
            [
                'id' => 2,
                'src' => 'assets/images/landingpage/slider/scarpa2.png',
                'alt_text' => 'Y2K',
                'name' => 'Y2K',
                'is_free_shipping' => false,
                'is_active' => true,
                'order_index' => 2,
                'created_at' => '2025-05-18 13:24:43',
                'updated_at' => '2025-05-18 13:24:43'
            ],
            [
                'id' => 3,
                'src' => 'assets/images/landingpage/slider/scarpa3.png',
                'alt_text' => 'Air Force 1',
                'name' => 'Air Force 1',
                'is_free_shipping' => true,
                'is_active' => true,
                'order_index' => 3,
                'created_at' => '2025-05-18 13:24:43',
                'updated_at' => '2025-05-18 13:24:43'
            ],
            [
                'id' => 4,
                'src' => 'assets/images/landingpage/slider/scarpa4.png',
                'alt_text' => 'Field General',
                'name' => 'Field General',
                'is_free_shipping' => false,
                'is_active' => true,
                'order_index' => 4,
                'created_at' => '2025-05-18 13:24:43',
                'updated_at' => '2025-05-18 13:24:43'
            ],
            [
                'id' => 5,
                'src' => 'assets/images/landingpage/slider/scarpa5.png',
                'alt_text' => 'Air Jordan',
                'name' => 'Air Jordan',
                'is_free_shipping' => false,
                'is_active' => true,
                'order_index' => 5,
                'created_at' => '2025-05-18 13:24:43',
                'updated_at' => '2025-05-18 13:24:43'
            ],
            [
                'id' => 6,
                'src' => 'assets/images/landingpage/slider/scarpa6.png',
                'alt_text' => 'Pegasus',
                'name' => 'Pegasus',
                'is_free_shipping' => false,
                'is_active' => true,
                'order_index' => 6,
                'created_at' => '2025-05-18 13:24:43',
                'updated_at' => '2025-05-18 13:24:43'
            ],
            [
                'id' => 7,
                'src' => 'assets/images/landingpage/slider/scarpa7.png',
                'alt_text' => 'Metcon',
                'name' => 'Metcon',
                'is_free_shipping' => false,
                'is_active' => true,
                'order_index' => 7,
                'created_at' => '2025-05-18 13:24:43',
                'updated_at' => '2025-05-18 13:24:43'
            ],
            [
                'id' => 8,
                'src' => 'assets/images/landingpage/slider/scarpa8.png',
                'alt_text' => 'Mercurial',
                'name' => 'Mercurial',
                'is_free_shipping' => true,
                'is_active' => true,
                'order_index' => 8,
                'created_at' => '2025-05-18 13:24:43',
                'updated_at' => '2025-05-18 13:24:43'
            ]
        ];

        foreach ($sliderImages as $imageData) {
            SliderImage::create($imageData);
        }
    }
}