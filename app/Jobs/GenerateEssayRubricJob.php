<?php

namespace App\Jobs;

use App\Enums\QuestionTypeEnum;
use App\Models\Option;
use App\Models\Question;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Facades\Prism;

class GenerateEssayRubricJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected string $questionId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $question = Question::find($this->questionId);

        if (!$question) {
            Log::error("Question not found for ID: {$this->questionId}");
            return;
        }

        // Validate question type
        if ($question->question_type !== QuestionTypeEnum::Essay) {
            Log::error("Question type must be Essay. Found: {$question->question_type->value}");
            return;
        }

        // Build AI prompt
        $prompt = $this->buildPrompt($question);

        try {
            Log::info("Generating rubric for Question ID: {$this->questionId}");

            $response = Prism::text()
                ->using(Provider::Gemini, 'gemini-flash-latest')
                ->withPrompt($prompt)
                ->asText();

            $json = $this->extractJson($response->text);
            $rubricData = json_decode($json, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('AI Rubric Generation Failed: JSON Decode Error', [
                    'error' => json_last_error_msg(),
                    'response' => substr($response->text, 0, 500)
                ]);
                return;
            }

            // Create or update the Essay option
            $this->saveRubric($question, $rubricData);

            Log::info("Successfully generated rubric for Question ID: {$this->questionId}");
        } catch (\Exception $e) {
            Log::error('AI Rubric Generation Exception', [
                'message' => $e->getMessage(),
                'question_id' => $this->questionId
            ]);
            throw $e;
        }
    }

    /**
     * Build the AI prompt for generating essay rubric
     */
    protected function buildPrompt(Question $question): string
    {
        $cleanContent = strip_tags($question->content);

        return <<<EOT
        You are an expert teacher creating a grading rubric for an essay question.
        
        Question Content:
        "{$cleanContent}"
        
        Task:
        Generate a comprehensive grading rubric/answer key for this essay question in Bahasa Indonesia.
        
        The rubric should include:
        1. Key points that a student should cover in their answer
        2. Grading criteria (what makes a good answer vs a poor answer)
        3. An example of a model answer
        4. Common mistakes to watch for
        
        Format your response as a valid JSON object with this structure:
        {
            "rubric": "Detailed grading rubric text in Bahasa Indonesia explaining how to grade this essay",
            "key_points": [
                "Key point 1 that should be mentioned",
                "Key point 2 that should be mentioned",
                "Key point 3 that should be mentioned"
            ],
            "model_answer": "An example of what a good answer would look like",
            "common_mistakes": [
                "Common mistake 1 to watch for",
                "Common mistake 2 to watch for"
            ]
        }
        
        Important:
        - Write everything in Bahasa Indonesia
        - Be specific and detailed
        - The rubric should be helpful for both manual and AI-assisted grading
        - Return ONLY valid JSON, no additional text
        EOT;
    }

    /**
     * Extract JSON from AI response (handles markdown code blocks)
     */
    protected function extractJson(string $text): string
    {
        // Try to extract from markdown code block first
        if (preg_match('/```json\s*(\{.*?\})\s*```/s', $text, $matches)) {
            return $matches[1];
        } elseif (preg_match('/(\{.*\})/s', $text, $matches)) {
            return $matches[1];
        }
        return $text;
    }

    /**
     * Save the generated rubric to the database
     */
    protected function saveRubric(Question $question, array $rubricData): void
    {
        // Check if an essay option already exists
        $existingOption = $question->options()
            ->where('option_key', 'ESSAY')
            ->first();

        $rubricContent = $rubricData['rubric'] ?? 'No rubric generated';

        $metadata = [
            'type' => 'rubric',
            'key_points' => $rubricData['key_points'] ?? [],
            'model_answer' => $rubricData['model_answer'] ?? null,
            'common_mistakes' => $rubricData['common_mistakes'] ?? [],
            'generated_by_ai' => true,
            'generated_at' => now()->toISOString(),
        ];

        if ($existingOption) {
            // Update existing option
            $existingOption->update([
                'content' => $rubricContent,
                'metadata' => $metadata,
            ]);

            Log::info("Updated existing rubric for Question ID: {$this->questionId}");
        } else {
            // Create new option
            Option::create([
                'question_id' => $question->id,
                'option_key' => 'ESSAY',
                'content' => $rubricContent,
                'order' => 0,
                'is_correct' => true,
                'metadata' => $metadata,
            ]);

            Log::info("Created new rubric for Question ID: {$this->questionId}");
        }
    }
}
