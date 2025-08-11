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
        // Create bot_keywords table if it doesn't exist
        if (!Schema::hasTable('bot_keywords')) {
            Schema::create('bot_keywords', function (Blueprint $table) {
                $table->id();
                $table->foreignId('bot_id')->constrained('bots')->onDelete('cascade');
                $table->foreignId('message_id')->constrained('messages')->onDelete('cascade');
                $table->string('keyword');
                $table->timestamps();
                
                // Ensure unique keywords per bot
                $table->unique(['bot_id', 'keyword']);
            });
        }

        // Add messages_id column to bots table if it doesn't exist
        if (!Schema::hasColumn('bots', 'messages_id')) {
            Schema::table('bots', function (Blueprint $table) {
                $table->foreignId('messages_id')->nullable()->constrained('messages')->onDelete('set null');
            });
        }

        // Remove keywords and messages JSON columns from bots table if they exist
        if (Schema::hasColumn('bots', 'keywords')) {
            Schema::table('bots', function (Blueprint $table) {
                $table->dropColumn('keywords');
            });
        }

        if (Schema::hasColumn('bots', 'messages')) {
            Schema::table('bots', function (Blueprint $table) {
                $table->dropColumn('messages');
            });
        }

        // Add user_id foreign key to shops if it doesn't exist
        if (!Schema::hasColumn('shops', 'user_id')) {
            Schema::table('shops', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            });
        }

        // Add subscription columns to shops if they don't exist
        if (!Schema::hasColumn('shops', 'subscription_expires_at')) {
            Schema::table('shops', function (Blueprint $table) {
                $table->timestamp('subscription_expires_at')->nullable();
            });
        }

        if (!Schema::hasColumn('shops', 'free_trial_started')) {
            Schema::table('shops', function (Blueprint $table) {
                $table->date('free_trial_started')->nullable();
            });
        }

        if (!Schema::hasColumn('shops', 'active_plan')) {
            Schema::table('shops', function (Blueprint $table) {
                $table->string('active_plan')->nullable();
            });
        }

        if (!Schema::hasColumn('shops', 'plan_date_expired')) {
            Schema::table('shops', function (Blueprint $table) {
                $table->date('plan_date_expired')->nullable();
            });
        }

        if (!Schema::hasColumn('shops', 'business_type')) {
            Schema::table('shops', function (Blueprint $table) {
                $table->string('business_type')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration is for fixing the database structure
        // No rollback needed as it's just ensuring consistency
    }
}; 