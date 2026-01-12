<?php

namespace App\Jobs;

use App\Enums\DifficultyLevelEnum;
use App\Enums\QuestionTypeEnum;
use App\Models\Option;
use App\Models\Question;
use App\Models\QuestionBank;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Facades\Prism;
use Illuminate\Support\Str;

class GenerateQuestionsWithAI implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 300;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected string $questionBankId,
        protected string $questionType, // Passed as string from command, cast to Enum logic inside
        protected string $topic,
        protected int $count = 5,
        protected string $difficulty = 'sedang'
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $questionBank = QuestionBank::find($this->questionBankId);

        if (!$questionBank) {
            Log::error("QuestionBank not found for ID: {$this->questionBankId}");
            return;
        }

        $typeEnum = QuestionTypeEnum::tryFrom($this->questionType);
        if (!$typeEnum) {
            Log::error("Invalid Question Type: {$this->questionType}");
            return;
        }

        $prompt = $this->buildPrompt($typeEnum);

        try {
            $response = Prism::text()
                ->using(Provider::Gemini, 'gemini-flash-latest')
                ->withPrompt($prompt)
                ->asText();

            $json = $this->extractJson($response->text);
            $questionsData = json_decode($json, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('AI Question Generation Failed: JSON Decode Error', [
                    'error' => json_last_error_msg(),
                    'response' => $response->text
                ]);
                return;
            }

            // Using transaction to ensure atomicity
            DB::transaction(function () use ($questionBank, $questionsData, $typeEnum) {
                foreach ($questionsData as $qData) {
                    $question = Question::create([
                        'question_bank_id' => $questionBank->id,
                        'question_type' => $typeEnum,
                        'difficulty_level' => $this->difficulty,
                        'content' => $qData['content'] ?? 'No Content',
                        'score_value' => 10, // Default score
                        'timer' => \App\Enums\TimerEnum::OneMinute, // Default 1 minute per question
                        'is_active' => true,
                        // 'is_approved' => true,
                    ]);

                    $this->createOptions($question, $typeEnum, $qData);
                }
            });

            Log::info("Successfully generated {$this->count} questions for Question Bank ID: {$this->questionBankId}");
        } catch (\Exception $e) {
            Log::error('AI Question Generation Exception', ['message' => $e->getMessage()]);
            throw $e;
        }
    }

    protected function buildPrompt(QuestionTypeEnum $type): string
    {
        $basePrompt = "You are an expert teacher creating an exam. 
        Create {$this->count} questions about '{$this->topic}'.
        Difficulty Level: {$this->difficulty}.
        Question Type: {$type->value}.
        Language: Bahasa Indonesia.
        
        Output STRICTLY valid JSON format. Return an ARRAY of objects.
        ";

        $schema = match ($type) {
            QuestionTypeEnum::MultipleChoice => <<<EOT
            Structure per object:
            {
                "content": "Question text here",
                "options": [
                    {"content": "Option A text", "is_correct": false},
                    {"content": "Option B text", "is_correct": true},
                    {"content": "Option C text", "is_correct": false},
                    {"content": "Option D text", "is_correct": false}
                ],
                "explanation": "Brief explanation" 
            }
            EOT,

            QuestionTypeEnum::TrueFalse => <<<EOT
            Structure per object:
            {
                "content": "Statement text here",
                "is_true": true/false (boolean),
                "explanation": "Brief explanation"
            }
            EOT,

            QuestionTypeEnum::Essay => <<<EOT
            Structure per object:
            {
                "content": "Essay question text here",
                "rubric": "Key answer or grading rubric text"
            }
            EOT,

            QuestionTypeEnum::Matching => <<<EOT
            Structure per object:
            {
                "content": "Instruction text (e.g. 'Match the following')",
                "pairs": [
                    {"left": "Item 1", "right": "Match 1"},
                    {"left": "Item 2", "right": "Match 2"},
                    {"left": "Item 3", "right": "Match 3"}
                ]
            }
            EOT,

            QuestionTypeEnum::Ordering => <<<EOT
            Structure per object:
            {
                "content": "Instruction text (e.g. 'Order the following steps')",
                "items": ["Step 1 (First)", "Step 2", "Step 3 (Last)"] (Must be in CORRECT order)
            }
            EOT,

            QuestionTypeEnum::MultipleSelection => <<<EOT
            Structure per object:
            {
                "content": "Question text here",
                "options": [
                    {"content": "Option A", "is_correct": true},
                    {"content": "Option B", "is_correct": false},
                    {"content": "Option C", "is_correct": true},
                    {"content": "Option D", "is_correct": false}
                ]
            }
            EOT,

            QuestionTypeEnum::NumericalInput => <<<EOT
            Structure per object:
            {
                "content": "Question text causing numerical answer",
                "answer": 10.5 (number)
            }
            EOT,

            QuestionTypeEnum::ArrangeWords => <<<EOT
            Structure per object:
            {
                "question": "Arrange these words to form a correct sentence",
                "sentence": "Ibu pergi ke pasar membeli sayur" (Full correct sentence)
            }
            EOT,
        };

        return $basePrompt . "\n" . $schema;
    }

    protected function createOptions(Question $question, QuestionTypeEnum $type, array $data): void
    {
        switch ($type) {
            case QuestionTypeEnum::MultipleChoice:
            case QuestionTypeEnum::MultipleSelection:
                // Handle naming keys automatically (A, B, C...)
                $options = [];
                foreach ($data['options'] as $idx => $opt) {
                    $options[] = [
                        'key' => chr(65 + $idx),
                        'content' => $opt['content'],
                        'is_correct' => $opt['is_correct'],
                        'order' => $idx
                    ];
                }
                Option::createMultipleChoiceOptions($question->id, $options);
                break;

            case QuestionTypeEnum::TrueFalse:
                Option::createTrueFalseOptions($question->id, $data['is_true']);
                break;

            case QuestionTypeEnum::Matching:
                Option::createMatchingOptions($question->id, $data['pairs']);
                break;

            case QuestionTypeEnum::Ordering:
                Option::createOrderingOptions($question->id, $data['items']);
                break;

            case QuestionTypeEnum::NumericalInput:
                Option::createNumericalInputOption($question->id, $data['answer']);
                break;

            case QuestionTypeEnum::Essay:
                Option::createEssayOption($question->id, $data['rubric']);
                break;

            case QuestionTypeEnum::ArrangeWords:
                Option::createArrangeWordsOption($question->id, $data['sentence']);
                // Update question content if needed, usually passed as "question" in JSON
                if (isset($data['question'])) {
                    $question->update(['content' => $data['question']]);
                }
                break;
        }
    }

    protected function extractJson(string $text): string
    {
        if (preg_match('/```json\s*(\[.*?\])\s*```/s', $text, $matches)) {
            return $matches[1];
        } elseif (preg_match('/(\[.*\])/s', $text, $matches)) {
            return $matches[1];
        }
        return $text;
    }
}
