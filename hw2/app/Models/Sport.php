<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sport extends Model
{
    protected $table = 'sports';
    
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