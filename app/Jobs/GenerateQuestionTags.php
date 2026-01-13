<?php

namespace App\Jobs;

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

class GenerateQuestionTags implements ShouldQueue
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
        protected string $questionBankId
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

        // Load all questions with eager loading
        $questions = Question::where('question_bank_id', $this->questionBankId)
            ->with('options')
            ->get();

        if ($questions->isEmpty()) {
            Log::info("No questions found in Question Bank ID: {$this->questionBankId}");
            return;
        }

        // Prepare question data for AI
        $questionsData = $questions->map(function ($question) {
            return [
                'id' => $question->id,
                'content' => $question->content,
                'question_type' => $question->question_type->value,
                'difficulty_level' => $question->difficulty_level->value,
            ];
        })->toArray();

        $prompt = $this->buildPrompt($questionsData);

        try {
            $response = Prism::text()
                ->using(Provider::Gemini, 'gemini-flash-latest')
                ->withPrompt($prompt)
                ->asText();

            $json = $this->extractJson($response->text);
            $tagsData = json_decode($json, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('AI Tag Generation Failed: JSON Decode Error', [
                    'error' => json_last_error_msg(),
                    'response' => $response->text
                ]);
                return;
            }

            // Apply tags to questions
            DB::transaction(function () use ($tagsData, $questions) {
                foreach ($tagsData as $tagInfo) {
                    $questionId = $tagInfo['question_id'] ?? null;
                    $tags = $tagInfo['tags'] ?? [];

                    if (!$questionId || empty($tags)) {
                        continue;
                    }

                    $question = $questions->firstWhere('id', $questionId);
                    if ($question) {
                        // Spatie Tags will automatically handle deduplication
                        // If a tag with the same name exists, it will reuse it
                        $question->syncTags($tags);
                    }
                }
            });

            Log::info("Successfully generated tags for {$questions->count()} questions in Question Bank ID: {$this->questionBankId}");
        } catch (\Exception $e) {
            Log::error('AI Tag Generation Exception', ['message' => $e->getMessage()]);
            throw $e;
        }
    }

    protected function buildPrompt(array $questionsData): string
    {
        $questionsJson = json_encode($questionsData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        return <<<EOT
You are an expert educator analyzing exam questions to generate relevant tags.

Your task:
1. Analyze each question's content, type, and difficulty level
2. Generate 2-4 concise, relevant tags for each question based on the subject matter/topic
3. Use the SAME tag name for questions about the same topic (for consistency and deduplication)
4. Tags should be in Bahasa Indonesia
5. Tags should be short (1-3 words), lowercase, and relate to the educational topic/concept

Questions to analyze:
$questionsJson

Output STRICTLY valid JSON format as an array of objects.

Structure:
[
    {
        "question_id": "question-id-here",
        "tags": ["tag1", "tag2", "tag3"]
    },
    ...
]

IMPORTANT: 
- Use consistent tag names across questions with similar topics
- For example, if multiple questions are about "sistem pernapasan", all should have tag "sistem pernapasan"
- Keep tags focused on the educational concept, not the question type
- Tags should be descriptive of the learning material/topic
EOT;
    }

    protected function extractJson(string $text): string
    {
        // Try to extract JSON from markdown code blocks
        if (preg_match('/```json\s*(\[.*?\])\s*```/s', $text, $matches)) {
            return $matches[1];
        } elseif (preg_match('/(\[.*\])/s', $text, $matches)) {
            return $matches[1];
        }
        return $text;
    }
}
