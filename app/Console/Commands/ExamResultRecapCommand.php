<?php

namespace App\Console\Commands;

use App\Models\ExamResult;
use App\Models\ExamSession;
use Illuminate\Console\Command;

class ExamResultRecapCommand extends Command
{
    protected $signature = 'exam:recap-results';
    protected $description = 'Mencari skor terbaik untuk setiap siswa pada setiap ujian dan merekapnya di ExamResult.';

    public function handle()
    {
        $this->info('🔄 Memulai Proses Rekapitulasi Hasil Ujian...');

        $students = ExamSession::distinct('user_id')->pluck('user_id');
        $updatedResults = 0;

        foreach ($students as $userId) {
            $examIds = ExamSession::where('user_id', $userId)->distinct('exam_id')->pluck('exam_id');

            foreach ($examIds as $examId) {
                // Temukan skor terbaik untuk ujian ini
                $bestSession = ExamSession::where('user_id', $userId)
                                          ->where('exam_id', $examId)
                                          ->whereNotNull('finish_time') // Hanya dari sesi yang sudah selesai
                                          ->orderByDesc('total_score')
                                          ->first();

                if ($bestSession) {
                    // Buat atau perbarui record di ExamResult
                    ExamResult::updateOrCreate(
                        ['user_id' => $userId, 'exam_id' => $examId],
                        [
                            'best_score' => $bestSession->total_score,
                            'best_session_id' => $bestSession->id,
                        ]
                    );
                    $updatedResults++;
                }
            }
        }

        $this->info("✅ {$updatedResults} Rekapitulasi ExamResult berhasil dibuat/diperbarui.");
        return self::SUCCESS;
    }
}