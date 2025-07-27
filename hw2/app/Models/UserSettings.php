<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSettings extends Model
{
    protected $table = 'user_settings';
    
    protected $fillable = [
        'user_id',
        'newsletter_enabled',
        'notifications_enabled'
    ];

    protected $casts = [
        'newsletter_enabled' => 'boolean',
        'notifications_enabled' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}