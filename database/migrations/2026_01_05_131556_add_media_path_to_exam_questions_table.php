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
        if (!Schema::hasColumn('exam_questions', 'media_path')) {
            Schema::table('exam_questions', function (Blueprint $table) {
                $table->string('media_path')->nullable()->after('content');
            });
        }

        if (!Schema::hasColumn('exam_questions', 'hint')) {
            Schema::table('exam_questions', function (Blueprint $table) {
                $table->text('hint')->nullable()->after('media_path');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_questions', function (Blueprint $table) {
            if (Schema::hasColumn('exam_questions', 'media_path')) {
                $table->dropColumn('media_path');
            }
            if (Schema::hasColumn('exam_questions', 'hint')) {
                $table->dropColumn('hint');
            }
        });
    }
};
