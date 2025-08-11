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
        Schema::create('bot_keywords', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bot_id')->constrained('bots')->onDelete('cascade');
            $table->foreignId('message_id')->constrained('messages')->onDelete('cascade');
            $table->string('keyword');
            $table->timestamps();
            
            // Ensure unique keywords per bot
            $table->unique(['bot_id', 'keyword']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bot_keywords');
    }
};
