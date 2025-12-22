<?php

namespace App\Console\Commands;

use App\Models\ExamSession;
use Illuminate\Console\Command;

class ExamResultScoreCommand extends Command
{
    /**
     * Nama dan signature command.
     * Command ini akan dijalankan dengan: php artisan exam:calculate-scores
     */
    protected $signature = 'exam:calculate-scores {--session=} {--force}';

    /**
     * Deskripsi command.
     */
    protected $description = 'Menghitung skor total setiap sesi ujian dari detail jawaban dan merekap hasilnya.';

    public function handle()
    {
        $this->info('🚀 Memulai Proses Perhitungan Skor Ujian...');
        
        $sessionId = $this->option('session');
        $force = $this->option('force');

        // 1. Dapatkan Sesi Ujian yang Perlu Dihitung
        // Relasi yang digunakan adalah 'details' sesuai model ExamSession
        $sessionsQuery = ExamSession::with('details');

        if ($sessionId) {
            $sessionsQuery->where('id', $sessionId);
            $this->info("   -> Menghitung hanya untuk Sesi ID: {$sessionId}");
        }

        // Kriteria default: Hanya hitung sesi yang belum memiliki finish_time
        if (!$force) {
            $sessionsQuery->whereNull('finish_time'); // Menggunakan finish_time
        } else {
             $this->warn('   -> Mode FORCE aktif: Menghitung ulang semua sesi, termasuk yang sudah selesai/berskor.');
        }

        $sessions = $sessionsQuery->get();
        $totalSessions = $sessions->count();

        if ($totalSessions === 0) {
            $this->error('❌ Tidak ada sesi yang perlu dihitung skornya.');
            return self::FAILURE;
        }

        $this->info("   -> Ditemukan {$totalSessions} sesi yang akan dihitung/dihitung ulang.");

        $bar = $this->output->createProgressBar($totalSessions);
        $bar->start();

        // 2. Loop dan Hitung Skor
        $updatedSessions = 0;
        foreach ($sessions as $session) {
            
            // Hitung total skor yang diperoleh dari detail jawaban
            // Menggunakan relasi details()
            $totalScore = $session->details()->sum('score_earned');

            if ($totalScore > 0 || $force) { // Hitung ulang meskipun skor 0 jika mode force
                // Perbarui ExamSession dengan skor dan status selesai
                $session->update([
                    'total_score' => $totalScore,
                    'is_finished' => true, // Set status selesai
                    // Gunakan finish_time yang sudah ada, atau waktu sekarang jika null
                    'finish_time' => $session->finish_time ?? now(), 
                ]);
                $updatedSessions++;
            }
            
            $bar->advance();
        }

        $bar->finish();
        $this->line(''); 

        $this->info("✅ {$updatedSessions} Sesi Ujian telah diperbarui skornya.");

        // 3. Rekap Hasil Akhir (ExamResult)
        // Memanggil command rekapitulasi untuk mengisi tabel ExamResult
        $this->callSilent('exam:recap-results');
        $this->info('✅ Hasil rekapitulasi (ExamResult) telah diperbarui.');

        return self::SUCCESS;
    }
}