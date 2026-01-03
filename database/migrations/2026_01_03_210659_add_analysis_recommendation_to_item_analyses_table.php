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
        Schema::table('item_analyses', function (Blueprint $table) {
            $table->text('analysis_recommendation')->nullable()->after('distractor_analysis');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('item_analyses', function (Blueprint $table) {
            $table->dropColumn('analysis_recommendation');
        });
    }
};
