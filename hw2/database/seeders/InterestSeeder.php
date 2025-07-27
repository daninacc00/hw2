<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InterestCategory;
use App\Models\Interest;

class InterestSeeder extends Seeder
{
    public function run(): void
    {
        // Inserimento categorie
        $categories = [
            ['id' => 1, 'name' => 'Sport', 'value' => 'sport'],
            ['id' => 2, 'name' => 'Articoli', 'value' => 'articles'],
            ['id' => 3, 'name' => 'Squadre', 'value' => 'teams'],
            ['id' => 4, 'name' => 'Atleti', 'value' => 'athletes'],
            ['id' => 5, 'name' => 'Città', 'value' => 'cities'],
        ];

        foreach ($categories as $category) {
            InterestCategory::create($category);
        }

        // Inserimento interessi
        $interests = [
            ['id' => 1, 'category_id' => 1, 'name' => 'Calcio', 'description' => 'Sport più popolare al mondo', 'value' => null, 'image_url' => '/assets/images/interests/calcio.jpg'],
            ['id' => 2, 'category_id' => 1, 'name' => 'Basket', 'description' => 'Pallacanestro', 'value' => null, 'image_url' => '/assets/images/interests/basket.jpg'],
            ['id' => 3, 'category_id' => 1, 'name' => 'Tennis', 'description' => 'Sport con racchetta', 'value' => null, 'image_url' => '/assets/images/interests/tennis.jpg'],
            ['id' => 4, 'category_id' => 1, 'name' => 'Nuoto', 'description' => 'Sport acquatico', 'value' => null, 'image_url' => '/assets/images/interests/nuoto.avif'],
            ['id' => 5, 'category_id' => 1, 'name' => 'Atletica', 'description' => 'Sport di corsa e salti', 'value' => null, 'image_url' => '/assets/images/interests/atletica.jpg'],
            ['id' => 10, 'category_id' => 3, 'name' => 'Atletico Madrid', 'description' => 'Squadra di calcio', 'value' => null, 'image_url' => '/assets/images/interests/atletico-madrid.jpg'],
            ['id' => 11, 'category_id' => 3, 'name' => 'Chelsea', 'description' => 'Squadra di calcio', 'value' => null, 'image_url' => '/assets/images/interests/chelsea.jpg'],
            ['id' => 12, 'category_id' => 3, 'name' => 'FC Barcelona', 'description' => 'Squadra di calcio', 'value' => null, 'image_url' => '/assets/images/interests/fc-barcelona.jpg'],
            ['id' => 13, 'category_id' => 3, 'name' => 'Inter', 'description' => 'Squadra di calcio', 'value' => null, 'image_url' => '/assets/images/interests/inter.jpg'],
            ['id' => 14, 'category_id' => 4, 'name' => 'Cristiano Ronaldo', 'description' => 'Calciatore portoghese', 'value' => null, 'image_url' => '/assets/images/interests/cristiano-ronaldo.jpg'],
            ['id' => 15, 'category_id' => 4, 'name' => 'Kylian Mbappé', 'description' => 'Calciatore francese', 'value' => null, 'image_url' => '/assets/images/interests/kylian-mbappé.jpg'],
            ['id' => 16, 'category_id' => 4, 'name' => 'Erling Haaland', 'description' => 'Calciatore', 'value' => null, 'image_url' => '/assets/images/interests/erling-haaland.avif'],
            ['id' => 17, 'category_id' => 4, 'name' => 'Vini Jr.', 'description' => 'Calciatore', 'value' => null, 'image_url' => '/assets/images/interests/vini-jr.avif'],
            ['id' => 18, 'category_id' => 5, 'name' => 'Berlino', 'description' => 'Città tedesca', 'value' => null, 'image_url' => '/assets/images/interests/berlino.jpg'],
            ['id' => 19, 'category_id' => 5, 'name' => 'Chicago', 'description' => 'Città americana', 'value' => null, 'image_url' => '/assets/images/interests/chicago.jpg'],
            ['id' => 20, 'category_id' => 5, 'name' => 'Milano', 'description' => 'Città economica dell\'Italia', 'value' => null, 'image_url' => '/assets/images/interests/milano.jpg'],
            ['id' => 21, 'category_id' => 5, 'name' => 'Madrid', 'description' => 'Città della Spagna', 'value' => null, 'image_url' => '/assets/images/interests/madrid.jpg'],
            ['id' => 22, 'category_id' => 2, 'name' => 'Air Force 1', 'description' => 'Scarpa di ginnastica', 'value' => null, 'image_url' => '/assets/images/interests/air-force-1.avif'],
            ['id' => 23, 'category_id' => 2, 'name' => 'Air Max', 'description' => 'Scarpa di ginnastica', 'value' => null, 'image_url' => '/assets/images/interests/air-max.avif'],
            ['id' => 24, 'category_id' => 2, 'name' => 'Jordan', 'description' => 'Scarpa di ginnastica', 'value' => null, 'image_url' => '/assets/images/interests/jordan.jpg'],
        ];

        foreach ($interests as $interest) {
            Interest::create($interest);
        }
    }
}