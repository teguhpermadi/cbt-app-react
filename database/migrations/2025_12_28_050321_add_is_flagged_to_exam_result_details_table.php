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
        Schema::table('exam_result_details', function (Blueprint $table) {
            $table->boolean('is_flagged')->default(false)->after('question_number'); // Add is_flagged column
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_result_details', function (Blueprint $table) {
            $table->dropColumn('is_flagged');
        });
    }
};
