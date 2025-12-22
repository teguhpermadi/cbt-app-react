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
        Schema::create('exam_result_details', function (Blueprint $table) {
            $table->ulid('id')->primary();
            
            // Foreign Keys
            $table->foreignUlid('exam_session_id')->references('id')->on('exam_sessions')->onDelete('cascade');
            
            $table->foreignUlid('exam_question_id')->references('id')->on('exam_questions')->onDelete('cascade');

            // Jawaban & Koreksi
            $table->json('student_answer')->nullable();
            $table->boolean('is_correct')->nullable()->comment('Null untuk Essay yang belum dikoreksi');
            $table->float('score_earned')->default(0);
            $table->text('correction_notes')->nullable();
            
            // Administrasi Pengerjaan
            $table->dateTime('answered_at')->nullable();
            $table->unsignedSmallInteger('time_spent')->nullable()->comment('Waktu dalam detik');

            $table->timestamps();
            
            // Constraint unik: Satu sesi pengerjaan hanya bisa memiliki satu jawaban per soal
            $table->unique(['exam_session_id', 'exam_question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_result_details');
    }
};
