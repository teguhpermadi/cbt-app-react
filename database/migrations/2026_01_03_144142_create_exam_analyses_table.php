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
        Schema::create('exam_analyses', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('exam_id')->constrained()->cascadeOnDelete();

            // Status processing
            $table->enum('status', ['processing', 'completed', 'failed'])->default('processing');

            // Exam Level Stats
            $table->integer('student_count')->default(0);
            $table->float('reliability_coefficient')->nullable(); // Cronbach's Alpha
            $table->float('average_score')->nullable();
            $table->float('standard_deviation')->nullable();
            $table->float('highest_score')->nullable();
            $table->float('lowest_score')->nullable();

            $table->timestamps();
        });

        Schema::create('item_analyses', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('exam_analysis_id')->constrained('exam_analyses')->cascadeOnDelete();

            // Reference to local exam question and original question bank
            $table->foreignUlid('exam_question_id')->constrained()->cascadeOnDelete();

            // Question ID might be null if the original question was deleted, but we keep the reference if possible
            $table->foreignUlid('question_id')->nullable()->constrained()->nullOnDelete();

            // Item Level Stats
            $table->float('difficulty_index')->nullable(); // P (0-1)
            $table->float('discrimination_index')->nullable(); // D (-1 to 1)
            $table->string('discrimination_status')->nullable(); // Poor, Fair, Good, Excellent

            // Distractor Analysis (JSON)
            // Format: { "A": { "count": 10, "percent": 20, "is_key": false }, ... }
            $table->json('distractor_analysis')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_analyses');
        Schema::dropIfExists('exam_analyses');
    }
};
