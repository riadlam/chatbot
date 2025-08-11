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
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('address')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('qr_code_path')->nullable();
            $table->enum('status', ['active', 'inactive', 'pending'])->default('pending');
            $table->boolean('is_verified')->default(false);
            $table->timestamp('subscription_expires_at')->nullable();
            $table->json('settings')->nullable(); // Store bot settings, welcome message, etc.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
