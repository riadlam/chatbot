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
        // Drop the existing bot_keywords table
        Schema::dropIfExists('bot_keywords');
        
        // Recreate bot_keywords table to reference bot_messages instead of messages
        Schema::create('bot_keywords', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bot_id')->constrained('bots')->onDelete('cascade');
            $table->foreignId('message_id')->constrained('bot_messages')->onDelete('cascade');
            $table->string('keyword');
            $table->timestamps();
            
            // Ensure unique keywords per bot
            $table->unique(['bot_id', 'keyword']);
        });
        
        // Remove the keyword_id column from messages table since it references the dropped keywords table
        if (Schema::hasColumn('messages', 'keyword_id')) {
            Schema::table('messages', function (Blueprint $table) {
                $table->dropForeign(['keyword_id']);
                $table->dropColumn('keyword_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the new bot_keywords table
        Schema::dropIfExists('bot_keywords');
        
        // Recreate the old structure
        Schema::create('bot_keywords', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bot_id')->constrained('bots')->onDelete('cascade');
            $table->foreignId('message_id')->constrained('messages')->onDelete('cascade');
            $table->string('keyword');
            $table->timestamps();
            
            $table->unique(['bot_id', 'keyword']);
        });
        
        // Add back keyword_id to messages table
        Schema::table('messages', function (Blueprint $table) {
            $table->foreignId('keyword_id')->nullable()->constrained()->onDelete('set null');
        });
    }
}; 