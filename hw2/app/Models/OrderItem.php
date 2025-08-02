<?php
<<<<<<< HEAD
=======
// app/Models/OrderItem.php
>>>>>>> cbefd853e5a5e28ff947e6b2594627d03f94e96c

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
<<<<<<< HEAD
    protected $table = 'order_items';

=======
>>>>>>> cbefd853e5a5e28ff947e6b2594627d03f94e96c
    protected $fillable = [
        'order_id',
        'product_id',
        'color_id',
        'size_id',
        'quantity',
        'price'
    ];

<<<<<<< HEAD
=======
    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer'
    ];

>>>>>>> cbefd853e5a5e28ff947e6b2594627d03f94e96c
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function color(): BelongsTo
    {
        return $this->belongsTo(Color::class);
    }

    public function size(): BelongsTo
    {
        return $this->belongsTo(Size::class);
    }
<<<<<<< HEAD
}
=======

    public function getTotalPriceAttribute(): string
    {
        return number_format($this->price * $this->quantity, 2);
    }
}
>>>>>>> cbefd853e5a5e28ff947e6b2594627d03f94e96c
