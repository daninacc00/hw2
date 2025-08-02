<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interest extends Model
{
    protected $table = 'interests';

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'value',
        'image_url'
    ];

    public function category()
    {
        return $this->belongsTo(InterestCategory::class, 'category_id');
    }
}