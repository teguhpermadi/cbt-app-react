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
        Schema::create('questions', function (Blueprint $table) {
            $table->ulid('id')->primary(); // ULID Primary Key
            
            // Foreign Keys
            $table->foreignUlid('question_bank_id')->references('id')->on('question_banks')->onDelete('cascade');
            
            $table->foreignUlid('reading_material_id')->nullable()->references('id')->on('reading_materials')->onDelete('set null');

            // Data Soal
            $table->string('question_type');
            $table->string('difficulty_level');
            
            $table->longText('content'); // Konten soal (teks dan media)
            $table->json('options');    // Opsi Jawaban (termasuk media_id)
            $table->json('key_answer'); // Kunci Jawaban (termasuk rubrik/jawaban kompleks)
            
            // Penskoran & Status
            $table->unsignedSmallInteger('score_value')->default(1); // Bobot nilai default
            $table->boolean('is_active')->default(true);
            $table->boolean('is_approved')->default(false); // Default tidak disetujui (membutuhkan peer review)
            
            $table->timestamps();
            $table->softDeletes(); // Soft Deletes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
