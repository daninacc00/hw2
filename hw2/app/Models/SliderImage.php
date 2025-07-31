<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SliderImage extends Model
{
    protected $table = 'slider_images';
    
    protected $fillable = [
        'src',
        'alt_text',
        'name',
        'is_free_shipping',
        'is_active',
        'order_index'
    ];

    protected $casts = [
        'is_free_shipping' => 'boolean',
        'is_active' => 'boolean',
        'order_index' => 'integer'
    ];

    /**
     * Scope per ottenere solo le immagini attive
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope per ordinare per ordine di visualizzazione
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order_index', 'asc');
    }

    /**
     * Formatta i dati per l'API JavaScript
     */
    public function toApiArray()
    {
        return [
            'id' => $this->id,
            'src' => $this->src,
            'alt' => $this->alt_text,
            'name' => $this->name,
            'isFreeShipping' => $this->is_free_shipping
        ];
    }
}