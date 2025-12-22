<?php

namespace Database\Factories;

use App\Models\Exam;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExamSessionFactory extends Factory
{
    protected $model = ExamSession::class;

    public function definition(): array
    {
        // 1. Pastikan Exam dan Siswa ada
        $exam = Exam::inRandomOrder()->first() ?? Exam::factory()->create();
        $student = User::where('user_type', 'student')->inRandomOrder()->first() ?? User::factory()->create(['user_type' => 'student']);

        // Data waktu
        $startTime = $this->faker->dateTimeBetween('-3 days', 'now');
        $durationTaken = $this->faker->numberBetween(30, $exam->duration);
        $finishTime = (clone $startTime)->modify("+{$durationTaken} minutes");

        // Data skor dummy
        $score = $this->faker->randomFloat(2, 50, 100);
        
        // Cek berapa kali siswa ini sudah mencoba ujian yang sama
        $attemptNumber = ExamSession::where('exam_id', $exam->id)
            ->where('user_id', $student->id)
            ->max('attempt_number') + 1;

        return [
            'exam_id' => $exam->id,
            'user_id' => $student->id,
            
            'attempt_number' => $attemptNumber,
            'total_score' => $score,
            'is_finished' => $this->faker->boolean(90), // Anggap 90% selesai
            'is_corrected' => $this->faker->boolean(80), // Anggap 80% sudah terkoreksi
            
            'start_time' => $startTime,
            'finish_time' => $finishTime,
            'duration_taken' => $durationTaken,
            
            'ip_address' => $this->faker->ipv4(),
        ];
    }
}