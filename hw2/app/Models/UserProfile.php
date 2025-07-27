<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $table = 'user_profiles';
    
    protected $fillable = [
        'user_id',
        'birth_date',
        'phone',
        'interests'
    ];

    protected $casts = [
        'interests' => 'array',
        'birth_date' => 'date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}