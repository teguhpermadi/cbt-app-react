<?php

namespace Database\Seeders;

use App\Models\Exam;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Exam::factory(20)->create()->each(function ($exam) {
            // Replikasi logika copy soal dari CreateExam
            if ($exam->question_bank_id) {
                $questionBank = \App\Models\QuestionBank::with(['questions.options'])->find($exam->question_bank_id);

                if ($questionBank && $questionBank->questions->isNotEmpty()) {
                    $examQuestions = [];

                    $number = 1;

                    foreach ($questionBank->questions as $question) {
                        if (!$question->is_active) continue;

                        $examQuestions[] = [
                            'id' => \Illuminate\Support\Str::ulid(),
                            'exam_id' => $exam->id,
                            'question_id' => $question->id,
                            'question_number' => $number++,
                            'content' => $question->content,
                            'options' => json_encode($question->getOptionsForExam()),
                            'key_answer' => json_encode($question->getKeyAnswerForExam()),
                            'score_value' => $question->score_value,
                            'question_type' => $question->question_type->value,
                            'difficulty_level' => $question->difficulty_level->value,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }

                    if (!empty($examQuestions)) {
                        \App\Models\ExamQuestion::insert($examQuestions);
                    }
                }
            }
        });
    }
}
