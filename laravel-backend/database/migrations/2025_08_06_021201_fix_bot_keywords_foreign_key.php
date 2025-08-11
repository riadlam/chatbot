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
        Schema::table('bot_keywords', function (Blueprint $table) {
            // Drop the existing foreign key constraint
            $table->dropForeign(['message_id']);
            
            // Add the correct foreign key constraint to bot_messages table
            $table->foreign('message_id')->references('id')->on('bot_messages')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bot_keywords', function (Blueprint $table) {
            // Drop the correct foreign key constraint
            $table->dropForeign(['message_id']);
            
            // Restore the original foreign key constraint to messages table
            $table->foreign('message_id')->references('id')->on('messages')->onDelete('cascade');
        });
    }
};
