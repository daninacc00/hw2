<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_interests', function (Blueprint $table) {
            $table->integer('user_id');
            $table->integer('interest_id');
            $table->timestamp('added_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_interests');
    }
};