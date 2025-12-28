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
            $table->integer('question_number')->after('exam_question_id')->nullable(); // Add question_number column
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_result_details', function (Blueprint $table) {
            $table->dropColumn('question_number');
        });
    }
};
