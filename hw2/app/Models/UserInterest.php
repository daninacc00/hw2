<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserInterest extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'interest_id',
        'added_at'
    ];

    protected $casts = [
        'added_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function interest()
    {
        return $this->belongsTo(Interest::class);
    }
}
