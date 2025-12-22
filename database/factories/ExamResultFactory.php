<?php

namespace Database\Factories;

use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExamResultFactory extends Factory
{
    protected $model = ExamResult::class;

    public function definition(): array
    {
        // 1. Pastikan Exam, Siswa, dan Sesi sudah ada
        $exam = Exam::inRandomOrder()->first() ?? Exam::factory()->create();
        $student = User::where('user_type', 'student')->inRandomOrder()->first() ?? User::factory()->create(['user_type' => 'student']);
        
        // Ambil sesi pengerjaan acak atau buat sesi baru jika belum ada
        $session = ExamSession::where('exam_id', $exam->id)
            ->where('user_id', $student->id)
            ->inRandomOrder()
            ->first();
        
        if (!$session) {
            // Jika tidak ada sesi, buat sesi percobaan 1
            $session = ExamSession::factory()->create(['exam_id' => $exam->id, 'user_id' => $student->id]);
        }

        // Tentukan hasil yang paling relevan (misalnya, skor terbaik dari semua sesi)
        $bestSession = ExamSession::where('exam_id', $exam->id)
            ->where('user_id', $student->id)
            ->orderByDesc('total_score')
            ->first();

        // Data skor diambil dari sesi terbaik/terakhir
        $finalScore = $bestSession->total_score ?? $session->total_score;
        $isPassed = ($finalScore >= $exam->passing_score);
        
        return [
            'exam_id' => $exam->id,
            'user_id' => $student->id,
            'exam_session_id' => $bestSession->id ?? $session->id, // Tautkan ke sesi yang dijadikan rujukan
            
            'total_score' => $finalScore,
            'score_percent' => $finalScore, // Persentase = Skor (untuk dummy)
            'is_passed' => $isPassed,
            'result_type' => 'best_attempt', // Default menggunakan hasil terbaik
        ];
    }
}