<?php

namespace Database\Factories;

use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExamQuestionFactory extends Factory
{
    protected $model = ExamQuestion::class;

    public function definition(): array
    {
        // 1. Pastikan Exam dan Question sudah ada
        $exam = Exam::inRandomOrder()->first() ?? Exam::factory()->create();
        $question = Question::inRandomOrder()->first() ?? Question::factory()->create();

        // Salin data dari Question ke ExamQuestion
        return [
            'exam_id' => $exam->id,
            'question_id' => $question->id,
            
            // KOREKSI: Hapus ->unique(). Angka ini hanya placeholder jika Factory dipanggil tanpa Seeder.
            'question_number' => $this->faker->numberBetween(1, 50), 
            
            // Salinan data transaksional
            'content' => $question->content,
            'options' => $question->options, 
            'key_answer' => $question->key_answer,
            'score_value' => $question->score_value,
            'question_type' => $question->question_type,
            'difficulty_level' => $question->difficulty_level,
        ];
    }
}