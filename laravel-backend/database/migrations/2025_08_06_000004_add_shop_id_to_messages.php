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
        // Add shop_id column to messages table if it doesn't exist
        if (!Schema::hasColumn('messages', 'shop_id')) {
            Schema::table('messages', function (Blueprint $table) {
                $table->foreignId('shop_id')->constrained()->onDelete('cascade')->after('id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove shop_id column from messages table
        if (Schema::hasColumn('messages', 'shop_id')) {
            Schema::table('messages', function (Blueprint $table) {
                $table->dropForeign(['shop_id']);
                $table->dropColumn('shop_id');
            });
        }
    }
}; 