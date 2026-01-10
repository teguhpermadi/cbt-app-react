<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Facades\Prism;

class AICorrectionService
{
    /**
     * Grade an essay question using AI.
     *
     * @param string $question The question content.
     * @param string $rubric The grading rubric or key answer.
     * @param string $studentAnswer The student's answer.
     * @return array Contains 'score' (float) and 'notes' (string).
     */
    public function gradeEssay(string $question, string $rubric, string $studentAnswer): array
    {
        // Strip HTML tags from inputs to save tokens and avoid confusion, unless rich text is crucial?
        // Usually safe to strip for simple essay grading.
        $cleanQuestion = strip_tags($question);
        $cleanRubric = strip_tags($rubric);
        $cleanAnswer = strip_tags($studentAnswer);

        $prompt = <<<EOT
            You are an expert teacher grading an essay question.

            Context:
            1. Question: "{$cleanQuestion}"
            2. Rubric/Key Answer: "{$cleanRubric}"
            3. Student Answer: "{$cleanAnswer}"

            Grading Criteria:
            - Compare the Student Answer against the Question and Rubric.
            - Determine if the student understood the core concept requested by the Question.
            - Check if the Student Answer aligns with the key points in the Rubric.
            - If the student answer is partially correct, give partial credit.
            
            Task:
            1. Assign a score between 0 and 10.
            2. Provide constructive feedback (correction notes) IN BAHASA INDONESIA. 
               - Explain WHY the score was given. 
               - If wrong, explain what is missing or incorrect based on the Rubric.

            Format your response as a JSON object:
            {
                "score": <float, 0-10>,
                "notes": "<string, feedback in Bahasa Indonesia>"
            }
            EOT;

        try {
            $response = Prism::text()
                ->using(Provider::Gemini, 'gemini-2.5-flash-lite')
                ->withPrompt($prompt)
                ->asText();

            $textContent = $response->text;

            Log::info('AI Response', $response);

            // Extract JSON from potential markdown code blocks
            if (preg_match('/```json\s*(\{.*?\})\s*```/s', $textContent, $matches)) {
                $json = $matches[1];
            } elseif (preg_match('/(\{.*\})/s', $textContent, $matches)) {
                $json = $matches[1];
            } else {
                $json = $textContent;
            }

            $result = json_decode($json, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('AI Grading Failed: JSON Decode Error', [
                    'error' => json_last_error_msg(),
                    'content_snippet' => substr($textContent, 0, 100)
                ]);
                return ['score' => 0, 'notes' => 'Gagal memproses respon AI.'];
            }

            // Normalize score to 0-1 range if needed, or keep as raw.
            // The service consuming this should map it to the question's max score.
            // Let's return the simplified 0-10 score and let the caller scale it.

            Log::info('AI Grading Success', ['score' => $result['score'] ?? 0]);

            return [
                'score' => (float) ($result['score'] ?? 0),
                'notes' => $result['notes'] ?? 'Tidak ada catatan.',
            ];
        } catch (\Exception $e) {
            Log::error('AI Grading Exception', ['message' => $e->getMessage()]);
            return ['score' => 0, 'notes' => 'AI Grading tidak tersedia.'];
        }
    }
}
