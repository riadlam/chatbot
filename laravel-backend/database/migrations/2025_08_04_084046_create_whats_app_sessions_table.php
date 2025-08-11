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
        Schema::create('whats_app_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained()->onDelete('cascade');
            $table->string('session_id')->unique(); // Unique session identifier
            $table->string('phone_number')->nullable(); // Connected WhatsApp number
            $table->enum('status', ['connecting', 'connected', 'disconnected', 'error'])->default('connecting');
            $table->text('qr_code')->nullable(); // QR code data
            $table->string('qr_code_path')->nullable(); // Path to saved QR image
            $table->timestamp('last_activity')->nullable();
            $table->json('session_data')->nullable(); // WhatsApp session data
            $table->text('error_message')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['shop_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whats_app_sessions');
    }
};
