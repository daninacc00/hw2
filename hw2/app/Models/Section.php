<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $table = 'sections';
    
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