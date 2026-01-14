<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    /**
     * Jalankan seeder database.
     */
    public function run(): void
    {
        $this->command->info('Memulai proses Seeding CBT App...');

        // 1. Essential Seeders (Must run in all environments)
        $this->call([
            RoleAndPermissionSeeder::class, // Roles & Permissons
            // UserSeeder::class,              // Default Users (Admin)
            // AcademicYearSeeder::class,      // Master Data: Academic Years
            // GradeSeeder::class,             // Master Data: Grades
            // SubjectSeeder::class,           // Master Data: Subjects
        ]);

        // 2. Dummy Data (Skip in Production)
        if (app()->environment('local', 'development', 'staging')) {
            $this->command->info('Running Dummy Data Seeders for Development...');
            $this->call([
                UserSeeder::class,              // Dummy Users
                GradeUserSeeder::class,         // Student-Grade Relationships

                // Bank Soal
                ReadingMaterialSeeder::class,
                QuestionBankSeeder::class,
                QuestionSeeder::class,
                QuestionPeerReviewSeeder::class,

                // Ujian
                ExamSeeder::class,
                ExamQuestionSeeder::class,

                // Transaksional
                ExamSessionSeeder::class,
                ExamResultDetailSeeder::class,
            ]);

            $this->command->info('⏳ Menghitung Skor dan Merekap Hasil Akhir...');
            Artisan::call('exam:calculate-scores', ['--force' => true]);
            $this->command->info(Artisan::output());
        } else {
            // Production: Ensure Admin Exists
            $this->command->info('Production Environment detected. Skipping dummy data.');
            $this->call([
                UserSeeder::class, // Ensure basic Admin/Teacher/Student exists if handled by UserSeeder
            ]);
        }

        $this->command->info('✅ Proses Seeding CBT App selesai!');
    }
}
