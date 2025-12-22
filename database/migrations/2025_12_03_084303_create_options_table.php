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
        Schema::create('options', function (Blueprint $table) {
            $table->ulid('id')->primary();

            // Relasi ke Question
            $table->foreignUlid('question_id')
                ->constrained('questions')
                ->cascadeOnDelete();

            // Key/Label opsi (A, B, C, D atau 1, 2, 3 untuk ordering/matching)
            $table->string('option_key', 10);

            // Konten opsi (teks, HTML, atau referensi)
            $table->text('content')->nullable();

            // Path media jika opsi menggunakan gambar/audio/video
            // Bisa juga menyimpan ULID dari Spatie Media Library
            $table->string('media_path')->nullable();

            // Urutan tampilan opsi
            $table->unsignedInteger('order')->default(0);

            // Penanda apakah opsi ini adalah jawaban benar
            // Untuk multiple_choice, true_false, multiple_selection
            $table->boolean('is_correct')->default(false);

            // Metadata tambahan dalam format JSON
            // Untuk menyimpan data khusus per tipe soal:
            // - matching: {pair_id: 'x', match_with: 'y'}
            // - ordering: {correct_position: 3}
            // - numerical_input: {tolerance: 0.01, unit: 'cm'}
            $table->json('metadata')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Index untuk performa query
            $table->index(['question_id', 'order']);
            $table->index(['question_id', 'option_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('options');
    }
};
