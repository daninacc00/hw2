<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Section;
use App\Models\Sport;
use App\Models\Color;
use App\Models\Size;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        return view('shop');
    }

    public function getProducts(Request $request)
    {
        $filters = $this->parseFilters($request);
        $page = max(1, (int) $request->get('page', 1));
        $limit = min(50, max(1, (int) $request->get('limit', 20)));

        $result = $this->buildProductQuery($filters, $page, $limit);

        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }

    public function getProduct(Request $request)
    {
        $productId = $request->query('id');
        $userId = session('user_id');

        if (!$productId) {
            return response()->json([
                'success' => false,
                'message' => 'ID prodotto mancante'
            ]);
        }

        $product = new Product();
        $result = $product->getProductById($productId, $userId);

        return response()->json($result);
    }

    private function parseFilters(Request $request)
    {
        $filters = [];

        // Filtri semplici
        if ($request->has('section')) $filters['section'] = $request->get('section');
        if ($request->has('sort')) $filters['sort'] = $request->get('sort');
        if ($request->has('shoe_height')) $filters['shoe_height'] = $request->get('shoe_height');

        // Filtri array
        if ($request->has('gender')) {
            $genderValue = $request->get('gender');

            // Converte i parametri stringa ai numeri che usa il tuo sistema
            if ($genderValue === 'men') {
                $filters['gender'] = [0];
            } elseif ($genderValue === 'women') {
                $filters['gender'] = [1];
            } elseif ($genderValue === 'kids') {
                $filters['gender'] = [2];
            } else {
                // Se è già un array di numeri (dai filtri JS)
                $gender = $request->get('gender');
                $filters['gender'] = is_array($gender) ? $gender : [$gender];
            }
        }

        if ($request->has('sport')) {
            $sport = $request->get('sport');
            $filters['sport'] = is_array($sport) ? $sport : [$sport];
        }

        if ($request->has('colors')) {
            $colors = $request->get('colors');
            $filters['colors'] = is_array($colors) ? $colors : [$colors];
        }

        if ($request->has('sizes')) {
            $sizes = $request->get('sizes');
            $filters['sizes'] = is_array($sizes) ? $sizes : [$sizes];
        }

        // Filtri prezzo
        if ($request->has('min_price') && $request->get('min_price') !== '') {
            $filters['min_price'] = (float) $request->get('min_price');
        }
        if ($request->has('max_price') && $request->get('max_price') !== '') {
            $filters['max_price'] = (float) $request->get('max_price');
        }

        // Filtri booleani
        if ($request->has('is_on_sale')) {
            $filters['is_on_sale'] = ($request->get('is_on_sale') === 'true' || $request->get('is_on_sale') === '1');
        }
        if ($request->has('is_bestseller')) {
            $filters['is_bestseller'] = ($request->get('is_bestseller') === 'true' || $request->get('is_bestseller') === '1');
        }
        if ($request->has('is_new_arrival')) {
            $filters['is_new_arrival'] = ($request->get('is_new_arrival') === 'true' || $request->get('is_new_arrival') === '1');
        }

        return $filters;
    }

    private function buildProductQuery($filters, $page, $limit)
    {
        $query = Product::with(['category', 'section', 'sport', 'primaryImage', 'colors'])
            ->where('status', 0);

        // Applicazione filtri
        if (isset($filters['section'])) {
            $query->whereHas('section', function ($q) use ($filters) {
                $q->where('slug', $filters['section']);
            });
        }

        if (isset($filters['gender']) && !empty($filters['gender'])) {
            $query->whereIn('gender', $filters['gender']);
        }

        if (isset($filters['sport']) && !empty($filters['sport'])) {
            $query->whereHas('sport', function ($q) use ($filters) {
                $q->whereIn('slug', $filters['sport']);
            });
        }

        if (isset($filters['colors']) && !empty($filters['colors'])) {
            $query->whereHas('colors', function ($q) use ($filters) {
                $q->whereIn('hex_code', $filters['colors']);
            });
        }

        if (isset($filters['sizes']) && !empty($filters['sizes'])) {
            $query->whereHas('sizes', function ($q) use ($filters) {
                $q->whereIn('value', $filters['sizes']);
            });
        }

        // Filtri prezzo
        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }
        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        // Filtri booleani
        if (isset($filters['is_on_sale']) && $filters['is_on_sale']) {
            $query->where('is_on_sale', true);
        }
        if (isset($filters['is_bestseller']) && $filters['is_bestseller']) {
            $query->where('is_bestseller', true);
        }
        if (isset($filters['is_new_arrival']) && $filters['is_new_arrival']) {
            $query->where('is_new_arrival', true);
        }

        if (isset($filters['shoe_height'])) {
            $heightMap = ['low' => 0, 'mid' => 1, 'high' => 2];
            if (isset($heightMap[$filters['shoe_height']])) {
                $query->where('shoe_height', $heightMap[$filters['shoe_height']]);
            }
        }

        // Ordinamento
        $this->applySorting($query, $filters['sort'] ?? 'newest');

        // Conteggio totale
        $total = $query->count();

        // Paginazione
        $offset = ($page - 1) * $limit;
        $products = $query->offset($offset)->limit($limit)->get();

        // Formattazione risultati
        $formattedProducts = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'original_price' => $product->original_price,
                'discount_percentage' => $product->discount_percentage,
                'is_bestseller' => $product->is_bestseller,
                'is_new_arrival' => $product->is_new_arrival,
                'is_on_sale' => $product->is_on_sale,
                'rating' => $product->rating,
                'rating_count' => $product->rating_count,
                'primary_image' => $product->primaryImage ? $product->primaryImage->image_url : null,
                'category_name' => $product->category ? $product->category->display_name : null,
                'section_name' => $product->section ? $product->section->display_name : null,
                'sport_name' => $product->sport ? $product->sport->display_name : null,
                'color_count' => $product->colors->count()
            ];
        });

        return [
            'products' => $formattedProducts,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'last_page' => ceil($total / $limit)
            ]
        ];
    }

    private function applySorting($query, $sort)
    {
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }
    }
}
