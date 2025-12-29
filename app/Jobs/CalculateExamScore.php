<?php


namespace App\Jobs;

use App\Models\ExamSession;
use App\Models\ExamResult;
use App\Models\ExamResultDetail;
use App\Enums\QuestionTypeEnum;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CalculateExamScore implements ShouldQueue
{
    use Queueable;

    private $session;

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
    public function handle(): void
    {
        $session = $this->session->load(['exam', 'examResultDetails.examQuestion']);
        $exam = $session->exam;

        $totalMaxScore = 0;
        $totalEarnedScore = 0;

        DB::transaction(function () use ($session, &$totalMaxScore, &$totalEarnedScore) {
            foreach ($session->examResultDetails as $detail) {
                $examQuestion = $detail->examQuestion;
                $keyAnswer = $examQuestion->key_answer;
                $studentAnswer = $detail->student_answer;

                $isCorrect = false;
                $scoreEarned = 0;
                $maxScore = $examQuestion->score_value ?? 0;
                $totalMaxScore += $maxScore;

                if ($studentAnswer !== null) {
                    switch ($examQuestion->question_type) {
                        case QuestionTypeEnum::MultipleChoice:
                        case QuestionTypeEnum::TrueFalse:
                            $isCorrect = $studentAnswer === ($keyAnswer['answer'] ?? null);
                            break;

                        case QuestionTypeEnum::MultipleSelection:
                            $correctAnswers = $keyAnswer['answers'] ?? [];
                            $studentAnswers = is_array($studentAnswer) ? $studentAnswer : [];

                            // Check if student selected all correct answers and no incorrect ones
                            if (count($correctAnswers) === count($studentAnswers)) {
                                $diff = array_diff($correctAnswers, $studentAnswers);
                                $isCorrect = empty($diff);
                            }
                            break;

                        case QuestionTypeEnum::Matching:
                            $correctPairs = $keyAnswer['pairs'] ?? [];
                            $studentPairs = is_array($studentAnswer) ? $studentAnswer : [];

                            $isCorrect = true;
                            foreach ($correctPairs as $left => $right) {
                                if (!isset($studentPairs[$left]) || $studentPairs[$left] !== $right) {
                                    $isCorrect = false;
                                    break;
                                }
                            }
                            break;

                        case QuestionTypeEnum::Ordering:
                            $correctOrder = $keyAnswer['order'] ?? [];
                            $studentOrder = is_array($studentAnswer) ? $studentAnswer : [];
                            $isCorrect = $studentOrder === $correctOrder;
                            break;

                        case QuestionTypeEnum::NumericalInput:
                            $correctVal = (float)($keyAnswer['answer'] ?? 0);
                            $tolerance = (float)($keyAnswer['tolerance'] ?? 0);
                            $studentVal = (float)$studentAnswer;

                            $isCorrect = abs($studentVal - $correctVal) <= $tolerance;
                            break;

                        case QuestionTypeEnum::Essay:
                            // Essay requires manual grading
                            $isCorrect = null;
                            $scoreEarned = 0;
                            break;
                    }
                }

                if ($isCorrect === true) {
                    $scoreEarned = $maxScore;
                } elseif ($isCorrect === false) {
                    $scoreEarned = 0;
                }
                // If null (essay), score stays 0 until graded

                $detail->update([
                    'is_correct' => $isCorrect,
                    'score_earned' => $scoreEarned,
                ]);

                $totalEarnedScore += $scoreEarned;
            }

            // Update ExamSession total_score
            $session->update(['total_score' => $totalEarnedScore]);

            // Update or Create ExamResult
            $scorePercent = $totalMaxScore > 0 ? ($totalEarnedScore / $totalMaxScore) * 100 : 0;

            $existingResult = ExamResult::where('exam_id', $session->exam_id)
                ->where('user_id', $session->user_id)
                ->first();

            $shouldUpdate = !$existingResult || $scorePercent > $existingResult->score_percent;

            if ($shouldUpdate) {
                ExamResult::updateOrCreate(
                    [
                        'exam_id' => $session->exam_id,
                        'user_id' => $session->user_id,
                    ],
                    [
                        'exam_session_id' => $session->id,
                        'total_score' => $totalEarnedScore,
                        'score_percent' => $scorePercent,
                        'is_passed' => $scorePercent >= ($session->exam->passing_score ?? 0),
                        'result_type' => $existingResult ? 'best_attempt' : 'official',
                    ]
                );
            }
        });

        Log::info("Exam score calculated for session: {$session->id}", [
            'user_id' => $session->user_id,
            'exam_id' => $session->exam_id,
            'total_score' => $totalEarnedScore,
        ]);
    }
}
