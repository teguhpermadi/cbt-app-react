<?php

namespace Database\Factories;

use App\Enums\DifficultyLevelEnum;
use App\Enums\QuestionTypeEnum;
use App\Enums\TimerEnum;
use App\Models\Option;
use App\Models\Question;
use App\Models\QuestionBank;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition(): array
    {
        $questionBank = QuestionBank::inRandomOrder()->first() ?? QuestionBank::factory()->create();
        $type = $this->faker->randomElement(QuestionTypeEnum::cases());

        return [
            'question_bank_id' => $questionBank->id,
            'reading_material_id' => null,
            'question_type' => $type,
            'difficulty_level' => $this->faker->randomElement(DifficultyLevelEnum::cases()),
            'timer' => $this->faker->randomElement(TimerEnum::cases()),
            'content' => $this->generateQuestionContent($type),
            'score_value' => $this->faker->numberBetween(1, 5),
            'order' => $this->faker->numberBetween(1, 100),
            'is_active' => true,
            'is_approved' => $this->faker->boolean(50),
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (Question $question) {
            $this->createOptionsForQuestion($question);
        });
    }

    /**
     * Create a question with specific type
     */
    public function withType(QuestionTypeEnum $type): static
    {
        return $this->state(fn(array $attributes) => [
            'question_type' => $type,
            'content' => $this->generateQuestionContent($type),
        ]);
    }

    /**
     * Generate question content based on type
     */
    private function generateQuestionContent(QuestionTypeEnum $type): string
    {
        return match ($type) {
            QuestionTypeEnum::MultipleChoice => 'Pilih satu jawaban yang paling tepat dari pilihan yang tersedia: ' . $this->faker->sentence(),
            QuestionTypeEnum::MultipleSelection => 'Pilih semua jawaban yang benar (bisa lebih dari satu): ' . $this->faker->sentence(),
            QuestionTypeEnum::TrueFalse => 'Tentukan apakah pernyataan berikut benar atau salah: ' . $this->faker->sentence(),
            QuestionTypeEnum::Essay => 'Jelaskan secara mendalam mengenai: ' . $this->faker->sentence(),
            QuestionTypeEnum::Matching => 'Jodohkan item di Kolom Kiri dengan item yang tepat di Kolom Kanan.',
            QuestionTypeEnum::Ordering => 'Urutkan langkah-langkah berikut secara kronologis.',
            QuestionTypeEnum::NumericalInput => $this->generateNumericalQuestion(),
        };
    }

    /**
     * Generate numerical question with LaTeX
     */
    private function generateNumericalQuestion(): string
    {
        $mathExpressions = [
            'Hitung nilai dari $$\\frac{3}{4} + \\frac{2}{5}$$',
            'Jika $$x = 2$$, hitung nilai dari $$2x^2 + 3x - 5$$',
            'Hitung luas persegi panjang dengan panjang $$\\sqrt{16}$$ cm dan lebar $$\\frac{3}{2}$$ cm',
            'Hitung nilai dari $$\\sin(30°) + \\cos(60°)$$',
            'Jika $$a = 3$$ dan $$b = 4$$, hitung $$\\sqrt{a^2 + b^2}$$',
            'Hitung volume kubus dengan rusuk $$\\sqrt[3]{27}$$ cm',
        ];

        return $this->faker->randomElement($mathExpressions) . ' (Masukkan jawaban numerik)';
    }

    /**
     * Create options for question based on type
     */
    private function createOptionsForQuestion(Question $question): void
    {
        match ($question->question_type) {
            QuestionTypeEnum::MultipleChoice => $this->createMultipleChoiceOptions($question),
            QuestionTypeEnum::MultipleSelection => $this->createMultipleSelectionOptions($question),
            QuestionTypeEnum::TrueFalse => $this->createTrueFalseOptions($question),
            QuestionTypeEnum::Matching => $this->createMatchingOptions($question),
            QuestionTypeEnum::Ordering => $this->createOrderingOptions($question),
            QuestionTypeEnum::NumericalInput => $this->createNumericalInputOption($question),
            QuestionTypeEnum::Essay => null, // Essay tidak memerlukan options
        };
    }

    /**
     * Create multiple choice options
     */
    private function createMultipleChoiceOptions(Question $question): void
    {
        $options = [];
        $correctKey = $this->faker->randomElement(['A', 'B', 'C', 'D']);

        foreach (['A', 'B', 'C', 'D'] as $key) {
            $options[] = [
                'key' => $key,
                'content' => $this->faker->sentence(3),
                'is_correct' => $key === $correctKey,
            ];
        }

        Option::createMultipleChoiceOptions($question->id, $options);
    }

    /**
     * Create multiple selection options
     */
    private function createMultipleSelectionOptions(Question $question): void
    {
        $options = [];
        $correctKeys = $this->faker->randomElements(['A', 'B', 'C', 'D'], $this->faker->numberBetween(2, 3));

        foreach (['A', 'B', 'C', 'D'] as $key) {
            $options[] = [
                'key' => $key,
                'content' => $this->faker->sentence(3),
                'is_correct' => in_array($key, $correctKeys),
            ];
        }

        Option::createMultipleChoiceOptions($question->id, $options);
    }

    /**
     * Create true/false options
     */
    private function createTrueFalseOptions(Question $question): void
    {
        $correctAnswer = $this->faker->boolean();
        Option::createTrueFalseOptions($question->id, $correctAnswer);
    }

    /**
     * Create matching options
     */
    private function createMatchingOptions(Question $question): void
    {
        $pairs = [];
        $topics = ['Indonesia', 'Malaysia', 'Thailand', 'Singapura'];
        $answers = ['Jakarta', 'Kuala Lumpur', 'Bangkok', 'Singapura'];

        for ($i = 0; $i < 4; $i++) {
            $pairs[] = [
                'left' => $topics[$i],
                'right' => $answers[$i],
            ];
        }

        Option::createMatchingOptions($question->id, $pairs);
    }

    /**
     * Create ordering options
     */
    private function createOrderingOptions(Question $question): void
    {
        $steps = [
            'Siapkan bahan-bahan yang diperlukan.',
            'Aduk rata telur dan gula.',
            'Masukkan terigu secara bertahap.',
            'Panggang selama 30 menit.',
        ];

        Option::createOrderingOptions($question->id, $steps);
    }

    /**
     * Create numerical input option
     */
    private function createNumericalInputOption(Question $question): void
    {
        $answers = [
            ['answer' => 1.15, 'tolerance' => 0.01, 'unit' => null],
            ['answer' => 9, 'tolerance' => 0.01, 'unit' => null],
            ['answer' => 6, 'tolerance' => 0.01, 'unit' => 'cm²'],
            ['answer' => 1, 'tolerance' => 0.01, 'unit' => null],
            ['answer' => 5, 'tolerance' => 0.01, 'unit' => null],
            ['answer' => 27, 'tolerance' => 0.01, 'unit' => 'cm³'],
        ];

        $selected = $this->faker->randomElement($answers);
        Option::createNumericalInputOption(
            $question->id,
            $selected['answer'],
            $selected['tolerance'],
            $selected['unit']
        );
    }
}
