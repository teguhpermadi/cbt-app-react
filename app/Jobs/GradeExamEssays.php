<?php

namespace App\Jobs;

use App\Enums\QuestionTypeEnum;
use App\Models\ExamSession;
use App\Services\AICorrectionService;
use App\Jobs\CalculateExamScore;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GradeExamEssays implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $session;

    /**
     * Create a new job instance.
     */
    public function __construct(ExamSession $session)
    {
        $this->session = $session;
    }

    /**
     * Execute the job.
     */
    public function handle(AICorrectionService $aiService): void
    {
        Log::info("Starting AI Essay Grading for Session: {$this->session->id}");

        $this->session->load(['examResultDetails.examQuestion']);

        $essayDetails = $this->session->examResultDetails->filter(function ($detail) {
            return $detail->examQuestion->question_type === QuestionTypeEnum::Essay;
        });

        if ($essayDetails->isEmpty()) {
            Log::info("No essay questions found for session {$this->session->id}");
            return;
        }

        foreach ($essayDetails as $detail) {
            // Skip if no answer provided
            if (empty($detail->student_answer)) {
                continue;
            }

            // Get Rubric from options
            $options = $detail->examQuestion->options;
            $rubricOption = null;

            if (is_array($options) && !empty($options)) {
                // Try to find the option with key 'ESSAY' (standard format from generator)
                foreach ($options as $opt) {
                    if (isset($opt['option_key']) && $opt['option_key'] === 'ESSAY') {
                        $rubricOption = $opt;
                        break;
                    }
                }

                // Fallback: Use the first option if specifically named option not found
                if (!$rubricOption) {
                    $rubricOption = reset($options);
                }
            }

            $rubric = $rubricOption['content'] ?? '';
            $rubricMetadata = $rubricOption['metadata'] ?? [];

            // If rubric is still empty, check Key Answer field as a fallback
            if (empty($rubric) && !empty($detail->examQuestion->key_answer)) {
                // key_answer is cast to array, but might store text in 'content' or just be a string if cast failed (unlikely)
                // Assuming key_answer might hold the rubric text if options doesn't.
                $rubric = is_array($detail->examQuestion->key_answer)
                    ? json_encode($detail->examQuestion->key_answer)
                    : $detail->examQuestion->key_answer;
            }

            if (empty($rubric)) {
                Log::warning("AI Grading Skipped: Missing rubric for Question {$detail->examQuestion->id}");
                continue;
            }

            // Call AI Service with expanded context
            $result = $aiService->gradeEssay(
                $detail->examQuestion->content,
                $rubric,
                $detail->student_answer,
                $rubricMetadata
            );

            Log::info("AI Service Result for Detail {$detail->id}: ", $result);

            if ($result['notes'] === 'AI Grading tidak tersedia.' || $result['notes'] === 'Gagal memproses respon AI.') {
                Log::error("AI Grading Success False for Detail {$detail->id}: " . $result['notes']);
            }

            // Calculate Scaled Score
            // AI gives 0-10. Max score is defined in examQuestion.
            $maxScore = $detail->examQuestion->score_value;
            $scaledScore = ($result['score'] / 10) * $maxScore;

            // Round to 1 decimal
            $scaledScore = round($scaledScore, 1);

            // Update Detail
            $detail->update([
                'score_earned' => $scaledScore,
                'correction_notes' => $result['notes'],
                'is_correct' => $scaledScore >= ($maxScore / 2),
            ]);

            Log::info("Graded Essay Detail {$detail->id}: Score {$scaledScore}/{$maxScore}");
        }

        // Recalculate Final Score
        CalculateExamScore::dispatch($this->session);

        Log::info("AI Essay Grading Completed for Session: {$this->session->id}");
    }
}
