<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\ExamSession;
use Illuminate\Database\Seeder;

class ExamResultSeeder extends Seeder
{
    public function run(): void
    {
        $sessions = ExamSession::all();

        if ($sessions->isEmpty()) {
            $this->command->warn('❌ ExamSession kosong. Harap jalankan ExamSessionSeeder terlebih dahulu.');
            return;
        }

        $this->command->info('Membuat hasil rekapitulasi akhir (ExamResult) dummy...');

        // Kelompokkan sesi berdasarkan kombinasi Ujian dan Siswa
        $uniqueSessions = $sessions->unique(function ($item) {
            return $item['exam_id'] . $item['user_id'];
        });

        $createdCount = 0;
        
        foreach ($uniqueSessions as $session) {
            // Cek apakah hasil rekap sudah ada
            if (!ExamResult::where('exam_id', $session->exam_id)->where('user_id', $session->user_id)->exists()) {
                ExamResult::factory()->create([
                    'exam_id' => $session->exam_id,
                    'user_id' => $session->user_id,
                    // Factory akan secara otomatis menemukan sesi terbaik dan mengisi detail
                ]);
                $createdCount++;
            }
        }
        
        $this->command->info("✅ {$createdCount} ExamResult rekapitulasi berhasil dibuat.");
    }
}