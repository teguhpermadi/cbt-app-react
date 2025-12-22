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
        Schema::create('exam_results', function (Blueprint $table) {
            $table->ulid('id')->primary();
            
            // Foreign Keys
            $table->foreignUlid('exam_id')->references('id')->on('exams')->onDelete('cascade');
            
            $table->foreignUlid('user_id')->references('id')->on('users')->onDelete('cascade')->comment('ID Siswa');
            
            $table->ulid('exam_session_id')->nullable()->comment('ID Sesi terbaik/resmi yang dijadikan rujukan');

            // Hasil Rekapitulasi Resmi
            $table->float('total_score')->default(0);
            $table->float('score_percent')->default(0);
            $table->boolean('is_passed')->default(false);
            $table->string('result_type')->default('official')->comment('official, best_attempt, latest_attempt');
            $table->float('best_score')->default(0);
            $table->foreignUlid('best_session_id')->nullable()->references('id')->on('exam_sessions')->onDelete('cascade');

            $table->timestamps();
            
            // Constraint unik: Satu Siswa hanya bisa memiliki satu hasil rekapitulasi per Ujian
            $table->unique(['exam_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_results');
    }
};
