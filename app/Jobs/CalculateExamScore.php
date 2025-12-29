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
                $maxScore = $examQuestion->score_value ?? 0;
                $totalMaxScore += $maxScore;

                // FIX: Decode student answer if it's a JSON string (Double Encoding Issue)
                if (is_string($studentAnswer)) {
                    $decoded = json_decode($studentAnswer, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $studentAnswer = $decoded;
                    }
                }

                if ($studentAnswer !== null) {
                    switch ($examQuestion->question_type) {
                        case QuestionTypeEnum::MultipleChoice:
                            $numberOfOptions = $keyAnswer['option_count'] ?? 4;
                            $keyVal = $keyAnswer['answer'] ?? null;

                            Log::info("Scoring MultipleChoice. QID: {$examQuestion->id}", [
                                'type' => 'MultipleChoice',
                                'student_raw' => $studentAnswer,
                                'key_raw' => $keyVal,
                                'match' => ($studentAnswer == $keyVal) ? 'true' : 'false'
                            ]);

                            if ($studentAnswer == $keyVal) {
                                $isCorrect = true;
                                $scoreEarned = $maxScore;
                            } else {
                                $isCorrect = false;
                                // Penalty removed as per request
                                $scoreEarned = 0;
                            }
                            break;

                        case QuestionTypeEnum::TrueFalse:
                            $keyVal = $keyAnswer['answer'] ?? null;

                            Log::info("Scoring TrueFalse. QID: {$examQuestion->id}", [
                                'type' => 'TrueFalse',
                                'student_raw' => $studentAnswer,
                                'key_raw' => $keyVal,
                                'match' => ($studentAnswer == $keyVal) ? 'true' : 'false'
                            ]);

                            // Standard scoring, no penalty requested for T/F
                            if ($studentAnswer == $keyVal) {
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

                            Log::info("Scoring MultipleSelection. QID: {$examQuestion->id}", [
                                'type' => 'MultipleSelection',
                                'student_selection' => $selectedByStudent,
                                'key_correct_options' => $correctKeys,
                            ]);

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

                            Log::info("Scoring Matching. QID: {$examQuestion->id}", [
                                'type' => 'Matching',
                                'student_pairs' => $studentPairs,
                                'key_pairs' => $correctPairs,
                            ]);

                            $correctMatchCount = 0;

                            // Iterate logic to check pairs
                            foreach ($correctPairs as $key => $val) {
                                $l = null;
                                $r = null;

                                if (is_array($val) && isset($val['left'])) {
                                    // Structure: [['left' => 'L1', 'right' => 'R1'], ...]
                                    $l = $val['left'];
                                    $r = $val['right'] ?? null;
                                } else {
                                    // Structure: ['L1' => 'R1', ...] (As seen in logs)
                                    $l = $key;
                                    $r = $val;
                                }

                                // Check if student has mapped k to v
                                // Note: Student answer is likely strictly L => R map as well
                                if ($l && isset($studentPairs[$l]) && $studentPairs[$l] == $r) {
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

                            Log::info("Scoring Ordering. QID: {$examQuestion->id}", [
                                'type' => 'Ordering',
                                'student_order' => $studentOrder,
                                'key_order' => $correctOrder,
                                'match' => ($studentOrder == $correctOrder) ? 'true' : 'false'
                            ]);

                            // Strict ordering check (relaxed to value equality)
                            if ($studentOrder == $correctOrder) {
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

                            Log::info("Scoring Numerical. QID: {$examQuestion->id}", [
                                'type' => 'Numerical',
                                'student_val' => $studentVal,
                                'key_val' => $correctVal,
                                'tolerance' => $tolerance,
                                'diff' => abs($studentVal - $correctVal)
                            ]);

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
