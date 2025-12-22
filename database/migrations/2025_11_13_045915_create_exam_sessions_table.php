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
        Schema::create('exam_sessions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            
            // Foreign Keys
            $table->foreignUlid('exam_id')->references('id')->on('exams')->onDelete('cascade');
            
            $table->foreignUlid('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Data Sesi
            $table->unsignedSmallInteger('attempt_number')->default(1);
            $table->float('total_score')->default(0);
            $table->boolean('is_finished')->default(false);
            $table->boolean('is_corrected')->default(false)->comment('Status koreksi untuk soal essay');
            
            $table->dateTime('start_time')->nullable();
            $table->dateTime('finish_time')->nullable();
            
            $table->unsignedSmallInteger('duration_taken')->nullable()->comment('Durasi pengerjaan dalam menit');
            
            $table->string('ip_address')->nullable();
            
            $table->timestamps();
            
            // Constraint unik: Siswa hanya bisa memiliki satu attempt_number per Exam
            $table->unique(['exam_id', 'user_id', 'attempt_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_sessions');
    }
};
