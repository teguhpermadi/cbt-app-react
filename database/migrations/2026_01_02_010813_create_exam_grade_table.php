<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exam_grade', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('exam_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('grade_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            // Prevent duplicate assignments
            $table->unique(['exam_id', 'grade_id']);
        });

        // Migrate existing data
        $exams = DB::table('exams')->get();
        $pivotData = [];

        foreach ($exams as $exam) {
            if ($exam->grade_id) {
                $pivotData[] = [
                    'exam_id' => $exam->id,
                    'grade_id' => $exam->grade_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (!empty($pivotData)) {
            DB::table('exam_grade')->insert($pivotData);
        }

        // Remove the old column
        Schema::table('exams', function (Blueprint $table) {
            $table->dropForeign(['grade_id']);
            $table->dropColumn('grade_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add the column back
        Schema::table('exams', function (Blueprint $table) {
            $table->foreignUlid('grade_id')->nullable()->constrained()->onDelete('set null');
        });

        // Restore date (take the first grade if multiple)
        $pivots = DB::table('exam_grade')->get();
        foreach ($pivots as $pivot) {
            DB::table('exams')
                ->where('id', $pivot->exam_id)
                ->update(['grade_id' => $pivot->grade_id]); // Will overwrite if multiple, acceptable for rollback
        }

        Schema::dropIfExists('exam_grade');
    }
};
