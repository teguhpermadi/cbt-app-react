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

        $this->call([
            // =========================================================
            // I. Konfigurasi Dasar (Harus ada terlebih dahulu)
            // =========================================================
            RoleAndPermissionSeeder::class, // Spatie Roles
            UserSeeder::class,              // User (Admin, Teacher, Student)
            AcademicYearSeeder::class,      // Tahun Ajaran
            GradeSeeder::class,             // Kelas
            SubjectSeeder::class,           // Mata Pelajaran
            GradeUserSeeder::class,         // Grade User

            // =========================================================
            // II. Bank Soal (Questions)
            // =========================================================
            ReadingMaterialSeeder::class,   // Materi Bacaan
            QuestionBankSeeder::class,      // Bank Soal
            QuestionSeeder::class,          // Soal Utama (dengan media)
            QuestionPeerReviewSeeder::class, // Review Soal

            // =========================================================
            // III. Konfigurasi Ujian
            // =========================================================
            ExamSeeder::class,              // Konfigurasi Ujian (Exam)
            ExamQuestionSeeder::class,      // Salinan Soal Ujian (ExamQuestion)

            // =========================================================
            // IV. Transaksional Ujian (Sesi & Hasil)
            // =========================================================
            ExamSessionSeeder::class,       // Sesi Pengerjaan Siswa (ExamSession)
            ExamResultDetailSeeder::class,  // Detail Jawaban per Soal (ExamResultDetail)
            // ExamResultSeeder::class,        // Rekapitulasi Hasil Resmi/Akhir (ExamResult)
        ]);

        // ⚠️ Gantikan ExamResultSeeder dengan Command Penskoran 
        $this->command->info('⏳ Menghitung Skor dan Merekap Hasil Akhir...');
        Artisan::call('exam:calculate-scores', ['--force' => true]);

        $this->command->info(Artisan::output());

        $this->command->info('✅ Proses Seeding CBT App selesai!');
    }
}
