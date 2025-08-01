<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InterestCategory extends Model
{
    protected $table = 'interest_categories';

    protected $fillable = [
        'name',
        'value'
    ];

    public function interests()
    {
        return $this->hasMany(Interest::class, 'category_id');
    }
}