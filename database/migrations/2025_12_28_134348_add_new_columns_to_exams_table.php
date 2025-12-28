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
        Schema::table('exams', function (Blueprint $table) {
            // Kolom untuk randomize jawaban (opsi)
            $table->boolean('is_answer_randomized')->default(false)->after('is_randomized');

            // Kolom untuk jumlah maksimal upaya siswa (null = unlimited)
            $table->unsignedInteger('max_attempts')->nullable()->after('is_answer_randomized');

            // Kolom untuk jenis timer (strict/flexible)
            $table->string('timer_type')->default('flexible')->after('max_attempts');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->dropColumn(['is_answer_randomized', 'max_attempts', 'timer_type']);
        });
    }
};
