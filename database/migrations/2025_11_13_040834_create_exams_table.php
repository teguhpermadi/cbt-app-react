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
        Schema::create('exams', function (Blueprint $table) {
            $table->ulid('id')->primary();
            
            // Foreign Keys (Konfigurasi)
            $table->foreignUlid('academic_year_id')->references('id')->on('academic_years')->onDelete('cascade');
            $table->foreignUlid('grade_id')->references('id')->on('grades')->onDelete('cascade');
            $table->foreignUlid('subject_id')->references('id')->on('subjects')->onDelete('cascade');
            $table->foreignUlid('teacher_id')->references('id')->on('users')->onDelete('restrict'); // Tidak boleh dihapus jika masih ada ujian aktif

            // Data Ujian
            $table->string('title');
            $table->string('exam_type');
            $table->unsignedSmallInteger('duration')->comment('Durasi dalam menit');
            $table->unsignedSmallInteger('total_questions');
            $table->unsignedSmallInteger('passing_score')->default(70);

            // Status & Waktu
            $table->boolean('is_published')->default(false);
            $table->boolean('is_randomized')->default(true);
            $table->dateTime('start_time')->nullable();
            $table->dateTime('end_time')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
