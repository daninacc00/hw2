<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SliderImage extends Model
{
    protected $table = 'slider_images';
    
    protected $fillable = [
        'src',
        'alt_text',
        'name',
        'is_free_shipping',
        'is_active',
        'order_index'
    ];
}