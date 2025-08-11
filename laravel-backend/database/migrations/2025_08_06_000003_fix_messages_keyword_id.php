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
        // Add back keyword_id column (but this will fail since keywords table doesn't exist)
        Schema::table('messages', function (Blueprint $table) {
            $table->foreignId('keyword_id')->nullable()->constrained()->onDelete('set null');
        });
    }
}; 