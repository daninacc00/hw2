<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';
    
    protected $fillable = [
        'name',
        'slug', 
        'display_name'
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}