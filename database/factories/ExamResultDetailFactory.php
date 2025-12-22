<?php

namespace Database\Factories;

use App\Models\ExamQuestion;
use App\Models\ExamResultDetail;
use App\Models\ExamSession;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExamResultDetailFactory extends Factory
{
    protected $model = ExamResultDetail::class;

    public function definition(): array
    {
        $session = ExamSession::inRandomOrder()->first() ?? ExamSession::factory()->create();
        $question = ExamQuestion::inRandomOrder()->first() ?? ExamQuestion::factory()->create();

        // Ambil data soal asli (ExamQuestion) untuk simulasi jawaban
        $keyAnswer = $question->key_answer;
        $scoreValue = $question->score_value;
        $questionType = $question->question_type;

        $isCorrect = $this->faker->boolean(70); // 70% benar
        $scoreEarned = $isCorrect ? $scoreValue : ($this->faker->boolean(20) ? $scoreValue / 2 : 0);
        
        // --- Simulasi Jawaban Siswa ---
        $studentAnswer = match ($questionType->value) {
            'multiple_choice' => $isCorrect 
                ? ($keyAnswer['answer'] ?? null) // Menggunakan ?? null
                : $this->faker->randomElement(['A', 'B', 'C', 'D']),
            
            // PERBAIKAN UTAMA: Menggunakan ?? [] untuk memastikan selalu array
            'multiple_selection' => $isCorrect 
                ? ($keyAnswer['answers'] ?? []) 
                : array_merge(
                    $keyAnswer['answers'] ?? [], // Safely get correct answers
                    [$this->faker->randomElement(['X', 'Y'])] // Add one incorrect answer
                ), 
                
            'essay' => $this->faker->paragraph(3), 
            
            // Menggunakan ?? [] untuk memastikan array urutan
            'ordering' => $isCorrect 
                ? ($keyAnswer['order'] ?? []) 
                : array_reverse($keyAnswer['order'] ?? ['A','B','C']),
                
            'numerical_input' => $isCorrect 
                ? ($keyAnswer['value'] ?? $this->faker->randomFloat(2, 1, 100))
                : ($keyAnswer['value'] ?? 50) + $this->faker->randomFloat(1, -2, 2),
                
            default => null,
        };

        return [
            'exam_session_id' => $session->id,
            'exam_question_id' => $question->id,
            'student_answer' => $studentAnswer,
            'is_correct' => ($questionType->value === 'essay') ? null : $isCorrect,
            'score_earned' => ($questionType->value === 'essay') ? 0 : $scoreEarned,
            'correction_notes' => ($questionType->value === 'essay' && $this->faker->boolean(50)) ? $this->faker->sentence() : null,
            'answered_at' => now()->subSeconds(rand(10, 300)),
            'time_spent' => rand(10, 90),
        ];
    }
}