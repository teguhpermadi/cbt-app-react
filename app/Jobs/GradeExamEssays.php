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

            // Get Rubric from the first option (ExamQuestion stores options as array)
            $options = $detail->examQuestion->options;

            // For Essay, we expect the rubric in the first option's content
            $rubric = null;
            if (is_array($options) && !empty($options)) {
                // Ensure we get the first one (they might not have 'order' key if simple array, 
                // but usually created with keys. Let's grab first element).
                $firstOption = reset($options);
                $rubric = $firstOption['content'] ?? '';
            }



            if (empty($rubric)) {
                Log::warning("AI Grading Skipped: Missing rubric for Question {$detail->examQuestion->id}");
                continue;
            }

            // Call AI Service
            $result = $aiService->gradeEssay(
                $detail->examQuestion->content,
                $rubric,
                $detail->student_answer
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
                'correction_notes' => $result['notes'] . " (AI Graded)",
                'is_correct' => $scaledScore >= ($maxScore / 2), // Boolean logic for essay is fuzzy, but let's say >= 50% is "correct"
            ]);

            Log::info("Graded Essay Detail {$detail->id}: Score {$scaledScore}/{$maxScore}");
        }

        // Recalculate Final Score
        CalculateExamScore::dispatch($this->session);

        Log::info("AI Essay Grading Completed for Session: {$this->session->id}");
    }
}
