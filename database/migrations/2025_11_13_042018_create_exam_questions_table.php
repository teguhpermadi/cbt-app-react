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
        Schema::create('exam_questions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            
            // Foreign Keys
            $table->foreignUlid('exam_id')->nullable()->references('id')->on('exams')->onDelete('cascade');
            
            $table->foreignUlid('question_id')->nullable()->references('id')->on('questions')->onDelete('set null');

            $table->unsignedSmallInteger('question_number')->comment('Urutan soal dalam ujian ini');
            
            // Salinan Data Soal (Transaksional)
            $table->longText('content');
            $table->json('options')->nullable();
            $table->json('key_answer')->nullable();
            
            $table->unsignedSmallInteger('score_value')->default(10);
            $table->string('question_type');
            $table->string('difficulty_level');

            $table->timestamps();
            
            // Constraint unik untuk mencegah duplikasi soal dalam satu ujian
            $table->unique(['exam_id', 'question_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_questions');
    }
};
