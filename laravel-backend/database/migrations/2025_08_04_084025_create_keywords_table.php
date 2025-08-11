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
        Schema::create('keywords', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained()->onDelete('cascade');
            $table->string('trigger_word'); // The keyword that triggers the response
            $table->text('response_message'); // The message to send when keyword is matched
            $table->boolean('is_active')->default(true);
            $table->integer('priority')->default(0); // Higher priority keywords are checked first
            $table->boolean('exact_match')->default(false); // Whether to match exact word or contains
            $table->json('conditions')->nullable(); // Additional conditions (time, user type, etc.)
            $table->timestamps();
            
            $table->unique(['shop_id', 'trigger_word']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keywords');
    }
};
