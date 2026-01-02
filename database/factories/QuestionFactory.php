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
            // Attach media to question if GD is available
            if (extension_loaded('gd')) {
                $this->attachDummyMedia($question, 'question_content', "Question");
            }

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

        $createdOptions = Option::createMultipleChoiceOptions($question->id, $options);

        if (extension_loaded('gd')) {
            foreach ($createdOptions as $option) {
                // Attach media to all options
                $this->attachDummyMedia($option, 'option_media', "Option {$option->option_key}");
            }
        }
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

        $createdOptions = Option::createMultipleChoiceOptions($question->id, $options);

        if (extension_loaded('gd')) {
            foreach ($createdOptions as $option) {
                $this->attachDummyMedia($option, 'option_media', "Option {$option->option_key}");
            }
        }
    }

    /**
     * Create true/false options
     */
    private function createTrueFalseOptions(Question $question): void
    {
        $correctAnswer = $this->faker->boolean();
        // Returns a collection
        $createdOptions = Option::createTrueFalseOptions($question->id, $correctAnswer);

        if (extension_loaded('gd')) {
            foreach ($createdOptions as $option) {
                $this->attachDummyMedia($option, 'option_media', "Option {$option->option_key}");
            }
        }
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

        $createdOptions = Option::createMatchingOptions($question->id, $pairs);

        if (extension_loaded('gd')) {
            foreach ($createdOptions as $option) {
                $this->attachDummyMedia($option, 'option_media', "Match {$option->option_key}");
            }
        }
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

        $createdOptions = Option::createOrderingOptions($question->id, $steps);

        if (extension_loaded('gd')) {
            foreach ($createdOptions as $option) {
                $this->attachDummyMedia($option, 'option_media', "Order {$option->option_key}");
            }
        }
    }

    /**
     * Create numerical input option
     */
    private function createNumericalInputOption(Question $question): void
    {
        $answers = [
            '$10$',
            '$-5$',
            '$\frac{1}{2}$',
            '$1.5$',
            '$\sqrt{25}$',
            '$2^3$',
            '$\pi$',
            '$\sin(90^\circ)$',
            '$\frac{3}{4}$',
            '$100$',
        ];

        $selected = $this->faker->randomElement($answers);
        $option = Option::createNumericalInputOption(
            $question->id,
            $selected
        );

        if (extension_loaded('gd')) {
            $this->attachDummyMedia($option, 'option_media', "Num {$option->option_key}");
        }
    }

    /**
     * Generate and attach a dummy image using GD
     */
    private function attachDummyMedia($model, string $collectionName, string $text): void
    {
        $width = 400;
        $height = 300;
        $image = imagecreatetruecolor($width, $height);

        // Random background color
        $bgColor = imagecolorallocate($image, rand(50, 200), rand(50, 200), rand(50, 200));
        imagefill($image, 0, 0, $bgColor);

        // Text color (White)
        $textColor = imagecolorallocate($image, 255, 255, 255);
        $font = 5; // Largest built-in font

        // Centering text
        $charWidth = imagefontwidth($font);
        $charHeight = imagefontheight($font);
        $textLen = strlen($text);

        $x = ($width - ($textLen * $charWidth)) / 2;
        $y = ($height - $charHeight) / 2;

        imagestring($image, $font, $x, $y, $text, $textColor);

        // Save to temp file
        $tempPath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . uniqid('media_', true) . '.jpg';
        imagejpeg($image, $tempPath);
        imagedestroy($image);

        // Attach to model using Spatie Media Library
        try {
            $model->addMedia($tempPath)
                ->preservingOriginal() // Keep the temp file for a moment if needed, but Spatie will copy it
                ->toMediaCollection($collectionName);
        } catch (\Exception $e) {
            // Log error or ignore
            // Log::error("Failed to attach media: " . $e->getMessage());
        }
    }
}
