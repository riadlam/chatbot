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
        Schema::table('shops', function (Blueprint $table) {
            $table->date('free_trial_started')->nullable()->after('status');
            $table->string('active_plan')->nullable()->after('free_trial_started');
            $table->date('plan_date_expired')->nullable()->after('active_plan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropColumn(['free_trial_started', 'active_plan', 'plan_date_expired']);
        });
    }
};
