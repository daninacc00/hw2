<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'price',
        'original_price',
        'discount_percentage',
        'category_id',
        'section_id',
        'sport_id',
        'gender',
        'shoe_height',
        'is_bestseller',
        'is_new_arrival',
        'is_on_sale',
        'stock_quantity',
        'rating',
        'rating_count',
        'status'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function colors()
    {
        return $this->belongsToMany(Color::class, 'product_colors');
    }

    public function sizes()
    {
        return $this->belongsToMany(Size::class, 'product_sizes');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function cart()
    {
        return $this->hasMany(Cart::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class);
    }

    public function getProductById($productId, $userId = null)
    {
        $product = Product::with(['colors', 'sizes', 'primaryImage'])
            ->where('id', $productId)
            ->first();

        if (!$product) {
            return [
                'success' => false,
                'message' => 'Prodotto non trovato'
            ];
        }

        $productData = $product->toArray();

        $primaryImage = $product->images->where('is_primary', true)->first();
        if ($primaryImage) {
            $productData['image_url'] = $primaryImage->image_url;
        }

        if ($userId) {
            $productData['isInCart'] = Cart::where('product_id', $productId)
                ->where('user_id', $userId)
                ->exists();

            $productData['isFavorite'] = Favorite::where('product_id', $productId)
                ->where('user_id', $userId)
                ->exists();
        }

        return [
            'success' => true,
            'data' => $productData
        ];
    }
}
