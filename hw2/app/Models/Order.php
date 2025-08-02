<?php
<<<<<<< HEAD
=======
// app/Models/Order.php
>>>>>>> cbefd853e5a5e28ff947e6b2594627d03f94e96c

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
<<<<<<< HEAD
    protected $table = 'orders';

=======
>>>>>>> cbefd853e5a5e28ff947e6b2594627d03f94e96c
    protected $fillable = [
        'user_id',
        'square_order_id',
        'status',
        'total_amount',
        'billing_name',
        'billing_email',
        'billing_address'
    ];

<<<<<<< HEAD
=======
    protected $casts = [
        'total_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

>>>>>>> cbefd853e5a5e28ff947e6b2594627d03f94e96c
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
<<<<<<< HEAD
=======

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => 'In attesa',
            'paid' => 'Pagato',
            'cancelled' => 'Annullato',
            default => ucfirst($this->status)
        };
    }
>>>>>>> cbefd853e5a5e28ff947e6b2594627d03f94e96c
}