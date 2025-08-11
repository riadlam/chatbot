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
        Schema::table('bots', function (Blueprint $table) {
            // Drop the existing messages JSON column
            $table->dropColumn('messages');
            
            // Add new messages_id column as foreign key
            $table->foreignId('messages_id')->nullable()->constrained('messages')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bots', function (Blueprint $table) {
            // Drop the foreign key column
            $table->dropForeign(['messages_id']);
            $table->dropColumn('messages_id');
            
            // Re-add the original messages JSON column
            $table->json('messages')->nullable();
        });
    }
};
