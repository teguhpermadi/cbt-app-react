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
        // Nilai yang sesuai dengan spesifikasi user_type Anda
        $userTypes = ['admin', 'teacher', 'student', 'parent'];

        Schema::table('users', function (Blueprint $table) use ($userTypes) {
            $table->enum('user_type', $userTypes)
                  ->default('student') // Beri nilai default yang aman
                  ->after('password'); // Letakkan setelah kolom 'password'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('user_type');
        });
    }
};
