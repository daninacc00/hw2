<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('slider_images', function (Blueprint $table) {
            $table->id();
            $table->string('src'); // URL dell'immagine
            $table->string('alt_text')->nullable(); // Testo alternativo
            $table->string('name'); // Nome/titolo dell'immagine
            $table->boolean('is_free_shipping')->default(false); // Flag spedizione gratuita
            $table->boolean('is_active')->default(true); // Flag attivo/disattivo
            $table->integer('order_index')->default(0); // Ordine di visualizzazione
            $table->timestamps();
            
            // Indici per performance
            $table->index(['is_active', 'order_index']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slider_images');
    }
};