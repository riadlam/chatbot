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
        Schema::create('bots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained('shops')->onDelete('cascade');
            $table->string('bot_type'); // customer-support, sales, marketing, general
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('inactive');
            $table->json('keywords')->nullable(); // Store keywords as JSON array
            $table->json('messages')->nullable(); // Store messages as JSON array
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bots');
    }
};
