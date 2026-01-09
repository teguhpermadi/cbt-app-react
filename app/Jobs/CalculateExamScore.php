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
    private $questionTypes; // Changed from singular to plural conceptual usage, but can be array

    /**
     * Create a new job instance.
     * @param string|array $questionTypes
     */
    public function __construct(ExamSession $session, $questionTypes = 'all')
    {
        $this->session = $session;
        // Normalize to array if it's not 'all'
        if ($questionTypes === 'all') {
            $this->questionTypes = 'all';
        } else {
            $this->questionTypes = is_array($questionTypes) ? $questionTypes : [$questionTypes];
        }
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

                // --- FILTER LOGIC ---
                // If questionType is NOT 'all' AND it does not match this question's type,
                // we skip recalculating but still must accumulate existing scores.

                // Note: $examQuestion->question_type is an Enum in the model cast.
                // We use ->value to get the string.
                $qTypeValue = $examQuestion->question_type instanceof \BackedEnum
                    ? $examQuestion->question_type->value
                    : $examQuestion->question_type;

                $shouldRecalculate = false;
                if ($this->questionTypes === 'all') {
                    $shouldRecalculate = true;
                } elseif (is_array($this->questionTypes) && in_array($qTypeValue, $this->questionTypes)) {
                    $shouldRecalculate = true;
                }

                if (!$shouldRecalculate) {
                    $maxScore = $examQuestion->score_value ?? 0;
                    $totalMaxScore += $maxScore;
                    $totalEarnedScore += $detail->score_earned;
                    continue;
                }
                // --------------------

                $maxScore = $examQuestion->score_value ?? 0;
                $totalMaxScore += $maxScore;

                // Process the score for this question
                $result = $this->calculateScoreForDetail($detail, $maxScore);

                $scoreEarned = $result['score'];
                $isCorrect = $result['is_correct'];

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
            $scorePercent = $totalMaxScore > 0 ? round(($totalEarnedScore / $totalMaxScore) * 100, 1) : 0;

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

        $typeLog = is_array($this->questionTypes) ? json_encode($this->questionTypes) : $this->questionTypes;
        Log::info("Exam score calculated for session: {$session->id} (Type: {$typeLog})", [
            'user_id' => $session->user_id,
            'exam_id' => $session->exam_id,
            'total_score' => $totalEarnedScore,
        ]);
    }

    private function calculateScoreForDetail($detail, $maxScore): array
    {
        $examQuestion = $detail->examQuestion;
        $keyAnswer = $examQuestion->key_answer;
        $studentAnswer = $detail->student_answer;

        // FIX: Decode student answer if it's a JSON string (Double Encoding Issue)
        if (is_string($studentAnswer)) {
            $decoded = json_decode($studentAnswer, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $studentAnswer = $decoded;
            }
        }

        if ($studentAnswer === null) {
            return ['score' => 0, 'is_correct' => false];
        }

        switch ($examQuestion->question_type) {
            case QuestionTypeEnum::MultipleChoice:
                return $this->scoreMultipleChoice($examQuestion, $studentAnswer, $keyAnswer, $maxScore);

            case QuestionTypeEnum::TrueFalse:
                return $this->scoreTrueFalse($examQuestion, $studentAnswer, $keyAnswer, $maxScore);

            case QuestionTypeEnum::MultipleSelection:
                return $this->scoreMultipleSelection($examQuestion, $studentAnswer, $keyAnswer, $maxScore);

            case QuestionTypeEnum::Matching:
                return $this->scoreMatching($examQuestion, $studentAnswer, $keyAnswer, $maxScore);

            case QuestionTypeEnum::Ordering:
                return $this->scoreOrdering($examQuestion, $studentAnswer, $keyAnswer, $maxScore);

            case QuestionTypeEnum::NumericalInput:
                return $this->scoreNumericalInput($examQuestion, $studentAnswer, $keyAnswer, $maxScore);

            case QuestionTypeEnum::Essay:
                return ['score' => $detail->score_earned ?? 0, 'is_correct' => null]; // Mantain existing or manual

            case QuestionTypeEnum::ArrangeWords:
                return $this->scoreArrangeWords($examQuestion, $studentAnswer, $keyAnswer, $maxScore);

            default:
                return ['score' => 0, 'is_correct' => false];
        }
    }

    private function scoreArrangeWords($question, $studentAnswer, $keyAnswer, $maxScore): array
    {
        $correctWords = $keyAnswer['words'] ?? [];
        $studentWords = is_array($studentAnswer) ? $studentAnswer : [];

        // Strict comparison of the sequence
        $isCorrect = ($studentWords === $correctWords);

        Log::info("Scoring ArrangeWords. QID: {$question->id}", [
            'type' => 'ArrangeWords',
            'student_words' => $studentWords,
            'correct_words' => $correctWords,
            'match' => $isCorrect ? 'true' : 'false'
        ]);

        return [
            'score' => $isCorrect ? $maxScore : 0,
            'is_correct' => $isCorrect
        ];
    }

    private function scoreMultipleChoice($question, $studentAnswer, $keyAnswer, $maxScore): array
    {
        $keyVal = $keyAnswer['answer'] ?? null;
        $isCorrect = ($studentAnswer == $keyVal);

        Log::info("Scoring MultipleChoice. QID: {$question->id}", [
            'type' => 'MultipleChoice',
            'student_raw' => $studentAnswer,
            'key_raw' => $keyVal,
            'match' => $isCorrect ? 'true' : 'false'
        ]);

        return [
            'score' => $isCorrect ? $maxScore : 0,
            'is_correct' => $isCorrect
        ];
    }

    private function scoreTrueFalse($question, $studentAnswer, $keyAnswer, $maxScore): array
    {
        $keyVal = $keyAnswer['answer'] ?? null;
        $isCorrect = ($studentAnswer == $keyVal);

        Log::info("Scoring TrueFalse. QID: {$question->id}", [
            'type' => 'TrueFalse',
            'student_raw' => $studentAnswer,
            'key_raw' => $keyVal,
            'match' => $isCorrect ? 'true' : 'false'
        ]);

        return [
            'score' => $isCorrect ? $maxScore : 0,
            'is_correct' => $isCorrect
        ];
    }

    private function scoreMultipleSelection($question, $studentAnswer, $keyAnswer, $maxScore): array
    {
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
        $scoreEarned = round($ratio * $maxScore, 1);
        $isCorrect = ($ratio == 1.0);

        Log::info("Scoring MultipleSelection. QID: {$question->id}", [
            'type' => 'MultipleSelection',
            'student_selection' => $selectedByStudent,
            'key_correct_options' => $correctKeys,
            'ratio' => $ratio,
            'score' => $scoreEarned
        ]);

        return [
            'score' => $scoreEarned,
            'is_correct' => $isCorrect
        ];
    }

    private function scoreMatching($question, $studentAnswer, $keyAnswer, $maxScore): array
    {
        $correctPairs = $keyAnswer['pairs'] ?? [];
        $totalPairs = count($correctPairs);
        $studentPairs = is_array($studentAnswer) ? $studentAnswer : [];

        $correctMatchCount = 0;

        foreach ($correctPairs as $key => $val) {
            $l = null;
            $r = null;

            if (is_array($val) && isset($val['left'])) {
                $l = $val['left'];
                $r = $val['right'] ?? null;
            } else {
                $l = $key;
                $r = $val;
            }

            if ($l && isset($studentPairs[$l]) && $studentPairs[$l] == $r) {
                $correctMatchCount++;
            }
        }

        $ratio = $totalPairs > 0 ? $correctMatchCount / $totalPairs : 0;
        $scoreEarned = round($ratio * $maxScore, 1);
        $isCorrect = ($ratio == 1.0);

        Log::info("Scoring Matching. QID: {$question->id}", [
            'type' => 'Matching',
            'student_pairs' => $studentPairs,
            'key_pairs' => $correctPairs,
            'ratio' => $ratio,
            'score' => $scoreEarned
        ]);

        return [
            'score' => $scoreEarned,
            'is_correct' => $isCorrect
        ];
    }

    private function scoreOrdering($question, $studentAnswer, $keyAnswer, $maxScore): array
    {
        $correctOrder = $keyAnswer['order'] ?? [];
        $studentOrder = is_array($studentAnswer) ? $studentAnswer : [];

        $isCorrect = ($studentOrder == $correctOrder);

        Log::info("Scoring Ordering. QID: {$question->id}", [
            'type' => 'Ordering',
            'student_order' => $studentOrder,
            'key_order' => $correctOrder,
            'match' => $isCorrect ? 'true' : 'false'
        ]);

        return [
            'score' => $isCorrect ? $maxScore : 0,
            'is_correct' => $isCorrect
        ];
    }

    private function scoreNumericalInput($question, $studentAnswer, $keyAnswer, $maxScore): array
    {
        $correctVal = (float)($keyAnswer['answer'] ?? 0);
        $tolerance = (float)($keyAnswer['tolerance'] ?? 0);
        $studentVal = (float)$studentAnswer;

        $isCorrect = abs($studentVal - $correctVal) <= $tolerance;

        Log::info("Scoring Numerical. QID: {$question->id}", [
            'type' => 'Numerical',
            'student_val' => $studentVal,
            'key_val' => $correctVal,
            'tolerance' => $tolerance,
            'diff' => abs($studentVal - $correctVal),
            'match' => $isCorrect ? 'true' : 'false'
        ]);

        return [
            'score' => $isCorrect ? $maxScore : 0,
            'is_correct' => $isCorrect
        ];
    }

    private function scoreWordCloud($question, $studentAnswer, $keyAnswer, $maxScore): array
    {
        $correctOrderKeys = $keyAnswer['order'] ?? [];
        $studentOrderKeys = is_array($studentAnswer) ? $studentAnswer : [];

        // options is an array of arrays/objects in ExamQuestion model
        $options = $question->options ?? [];

        $keyToContent = [];
        foreach ($options as $opt) {
            $key = is_array($opt) ? ($opt['option_key'] ?? '') : ($opt->option_key ?? '');
            $content = is_array($opt) ? ($opt['content'] ?? '') : ($opt->content ?? '');

            if ($key) {
                $keyToContent[$key] = trim($content);
            }
        }

        $studentContent = [];
        foreach ($studentOrderKeys as $k) {
            if (isset($keyToContent[$k])) {
                $studentContent[] = $keyToContent[$k];
            }
        }

        $correctContent = [];
        foreach ($correctOrderKeys as $k) {
            if (isset($keyToContent[$k])) {
                $correctContent[] = $keyToContent[$k];
            }
        }

        $isCorrect = ($studentContent === $correctContent);

        Log::info("Scoring WordCloud. QID: {$question->id}", [
            'type' => 'WordCloud',
            'student_content' => $studentContent,
            'correct_content' => $correctContent,
            'match' => $isCorrect ? 'true' : 'false'
        ]);

        return [
            'score' => $isCorrect ? $maxScore : 0,
            'is_correct' => $isCorrect
        ];
    }
}
