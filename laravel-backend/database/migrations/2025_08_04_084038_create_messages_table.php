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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained()->onDelete('cascade');
            $table->string('whatsapp_number'); // Customer's WhatsApp number
            $table->string('customer_name')->nullable();
            $table->text('message_content');
            $table->enum('direction', ['inbound', 'outbound']);
            $table->enum('message_type', ['text', 'image', 'document', 'audio', 'video', 'location'])->default('text');
            $table->string('media_url')->nullable(); // For media messages
            $table->string('message_id')->nullable(); // WhatsApp message ID
            $table->json('metadata')->nullable(); // Additional message data
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->boolean('is_bot_response')->default(false);
            $table->foreignId('keyword_id')->nullable()->constrained()->onDelete('set null'); // If triggered by keyword
            $table->timestamps();
            
            $table->index(['shop_id', 'whatsapp_number']);
            $table->index(['shop_id', 'sent_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
