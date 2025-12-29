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
                            $numberOfOptions = $keyAnswer['option_count'] ?? 4;
                            if ($studentAnswer === ($keyAnswer['answer'] ?? null)) {
                                $isCorrect = true;
                                $scoreEarned = $maxScore;
                            } else {
                                $isCorrect = false;
                                // Penalty removed as per request
                                $scoreEarned = 0;
                            }
                            break;

                        case QuestionTypeEnum::TrueFalse:
                            // Standard scoring, no penalty requested for T/F
                            if ($studentAnswer === ($keyAnswer['answer'] ?? null)) {
                                $isCorrect = true;
                                $scoreEarned = $maxScore;
                            } else {
                                $isCorrect = false;
                                $scoreEarned = 0;
                            }
                            break;

                        case QuestionTypeEnum::MultipleSelection:
                            $correctKeys = $keyAnswer['answers'] ?? [];
                            $totalCorrectOptions = count($correctKeys);
                            $selectedByStudent = is_array($studentAnswer) ? $studentAnswer : [];

                            // Calculate Intersect
                            $matches = array_intersect($correctKeys, $selectedByStudent);
                            $countRight = count($matches);

                            // Calculate Wrong Selections
                            $countWrong = count($selectedByStudent) - $countRight;

                            // Net Correct Logic
                            $netCorrect = $countRight - $countWrong;
                            if ($netCorrect < 0) $netCorrect = 0;

                            $ratio = $totalCorrectOptions > 0 ? $netCorrect / $totalCorrectOptions : 0;
                            $scoreEarned = $ratio * $maxScore;

                            $isCorrect = ($ratio == 1.0);
                            break;

                        case QuestionTypeEnum::Matching:
                            $correctPairs = $keyAnswer['pairs'] ?? [];
                            $totalPairs = count($correctPairs);
                            $studentPairs = is_array($studentAnswer) ? $studentAnswer : []; // [Left => Right]

                            $correctMatchCount = 0;

                            // Iterate logic to check pairs
                            // Structure of CorrectPairs usually: check if it's associative or array of objects
                            // Based on typical structure: ['pairs' => [['left'=>'A', 'right'=>'1'], ...]] OR ['A'=>'1', 'B'=>'2']
                            // Assuming Key structure is simplified K=>V for checking or array of pairs.
                            // Let's assume standard array of objects for pairs in DB/JSON usually:
                            // [{"left": "Indo", "right": "Jkt"}, ...]

                            // Re-mapping for easier check if needed, OR loop
                            // Let's rely on the structure being array of objects as per QuestionFactory

                            // Correct pairs from factory: array of ['left' => '...', 'right' => '...']

                            // Student answer format usually mirrors the input.
                            // If user sends component: usually { "left_id": "right_id" } map

                            // Let's assume studentPairs is a Map (Associative Array)

                            foreach ($correctPairs as $pair) {
                                $l = $pair['left'] ?? null;
                                $r = $pair['right'] ?? null;

                                // Check if student has mapped k to v
                                if (isset($studentPairs[$l]) && $studentPairs[$l] == $r) {
                                    $correctMatchCount++;
                                }
                            }

                            $ratio = $totalPairs > 0 ? $correctMatchCount / $totalPairs : 0;
                            $scoreEarned = $ratio * $maxScore;

                            $isCorrect = ($ratio == 1.0);
                            break;

                        case QuestionTypeEnum::Ordering:
                            $correctOrder = $keyAnswer['order'] ?? [];
                            $studentOrder = is_array($studentAnswer) ? $studentAnswer : [];

                            // Strict ordering check
                            if ($studentOrder === $correctOrder) {
                                $isCorrect = true;
                                $scoreEarned = $maxScore;
                            } else {
                                $isCorrect = false;
                                $scoreEarned = 0;
                            }
                            break;

                        case QuestionTypeEnum::NumericalInput:
                            $correctVal = (float)($keyAnswer['answer'] ?? 0);
                            $tolerance = (float)($keyAnswer['tolerance'] ?? 0);
                            $studentVal = (float)$studentAnswer;

                            if (abs($studentVal - $correctVal) <= $tolerance) {
                                $isCorrect = true;
                                $scoreEarned = $maxScore;
                            } else {
                                $isCorrect = false;
                                $scoreEarned = 0;
                            }
                            break;

                        case QuestionTypeEnum::Essay:
                            // Essay requires manual grading
                            $isCorrect = null; // Pending
                            $scoreEarned = 0;  // Initial score
                            break;
                    }
                } else {
                    // No Answer -> No Penalty (Usually)
                    $scoreEarned = 0;
                    $isCorrect = false;
                }

                $detail->update([
                    'is_correct' => $isCorrect,
                    'score_earned' => $scoreEarned,
                ]);

                $totalEarnedScore += $scoreEarned;
            }

            // Finalize Total Score (Floor at 0)
            if ($totalEarnedScore < 0) {
                $totalEarnedScore = 0;
            }

            // Update ExamSession total_score AND total_max_score
            $session->update([
                'total_score' => $totalEarnedScore,
                'total_max_score' => $totalMaxScore
            ]);

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
