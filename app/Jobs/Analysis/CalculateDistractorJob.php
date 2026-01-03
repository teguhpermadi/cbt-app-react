<?php

namespace App\Jobs\Analysis;

use App\Enums\QuestionTypeEnum;
use App\Models\ExamAnalysis;
use App\Models\ExamSession;
use App\Models\ItemAnalysis;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class CalculateDistractorJob implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $examAnalysisId;

    public function __construct(string $examAnalysisId)
    {
        $this->examAnalysisId = $examAnalysisId;
    }

    public function handle(): void
    {
        if ($this->batch()->cancelled()) {
            return;
        }

        $analysis = ExamAnalysis::findOrFail($this->examAnalysisId);
        $examId = $analysis->exam_id;

        $sessionIds = ExamSession::where('exam_id', $examId)
            ->where('is_finished', true)
            ->pluck('id');

        $studentCount = $sessionIds->count();
        if ($studentCount == 0) return;

        $items = ItemAnalysis::with(['examQuestion'])
            ->where('exam_analysis_id', $this->examAnalysisId)
            ->get();

        foreach ($items as $item) {
            $examQuestion = $item->examQuestion;
            if (!$examQuestion) continue;

            $type = $examQuestion->question_type;

            // Get answers for this question
            $details = DB::table('exam_result_details')
                ->where('exam_question_id', $examQuestion->id)
                ->whereIn('exam_session_id', $sessionIds)
                ->select('student_answer')
                ->get();

            // Structure: Key => { count, percent, is_key }
            $distribution = [];
            $options = $examQuestion->options ?? [];
            $keyAnswer = $examQuestion->key_answer['answer'] ?? null;

            // 1. Initialize predefined options for Choice-based questions
            // This ensures options with 0 votes still appear in the chart
            $isChoiceBased = in_array($type, [
                QuestionTypeEnum::MultipleChoice->value,
                QuestionTypeEnum::TrueFalse->value,
                QuestionTypeEnum::MultipleSelection->value
            ]);

            if ($isChoiceBased && is_array($options)) {
                foreach ($options as $opt) {
                    $key = $opt['key'] ?? $opt['option_key'] ?? null;
                    if ($key) {
                        $isKey = false;
                        if ($type === QuestionTypeEnum::MultipleSelection->value) {
                            $isKey = is_array($keyAnswer) && in_array($key, $keyAnswer);
                        } else {
                            $isKey = (string)$key === (string)$keyAnswer;
                        }

                        $distribution[$key] = [
                            'count' => 0,
                            'percent' => 0,
                            'is_key' => $isKey
                        ];
                    }
                }
            }

            // 2. Process Student Answers
            foreach ($details as $detail) {
                $answerData = json_decode($detail->student_answer, true);

                $rawAnswer = null;

                if (is_array($answerData)) {
                    // Check for structured answer { answer: ... }
                    if (array_key_exists('answer', $answerData)) {
                        $rawAnswer = $answerData['answer'];
                    } else {
                        // Assume it might be an array of selections directly ["A", "B"] or complex
                        // For MultipleChoice/TrueFalse, we expect single scalar, but keep safety
                        $rawAnswer = $answerData;
                    }
                } else {
                    // Scalar value (string/int) e.g. "A"
                    $rawAnswer = $answerData;
                }

                if ($rawAnswer === null || $rawAnswer === '') continue;

                // Normalize answer to a list of selection keys
                $selections = [];
                if ($type === QuestionTypeEnum::MultipleSelection->value && is_array($rawAnswer)) {
                    $selections = $rawAnswer; // Multi-select: count each selected option
                } elseif (is_array($rawAnswer)) {
                    // For Matching/Ordering, treating the whole JSON/Array structure as a unique "answer variant"
                    // We stringify it to use as a key
                    $selections = [json_encode($rawAnswer)];
                } else {
                    // Simple string/numeric answer
                    $selections = [(string)$rawAnswer];
                }

                foreach ($selections as $selKey) {
                    if (!isset($distribution[$selKey])) {
                        // Determine validity for dynamically added keys (e.g. Numerical/Essay)
                        $isKey = false;
                        if ($type === QuestionTypeEnum::MultipleSelection->value) {
                            $isKey = is_array($keyAnswer) && in_array($selKey, $keyAnswer);
                        } elseif ($type === QuestionTypeEnum::NumericalInput->value) {
                            // For numerical, strictly match the key answer
                            // (Note: ignoring tolerance/formulas for simple distractor analysis)
                            $isKey = (string)$selKey === (string)$keyAnswer;
                        } else {
                            // Default string match
                            $isKey = (string)$selKey === (string)$keyAnswer;

                            // For Matching/Ordering, keyAnswer usually matches the stringified structure if correct
                            // But usually key_answer is stored structurally.
                            // Complex type correctness check is hard here without full grading logic.
                            // For now, we rely on exact string match if possible, or default to false.
                        }

                        $distribution[$selKey] = [
                            'count' => 0,
                            'percent' => 0,
                            'is_key' => $isKey
                        ];
                    }
                    $distribution[$selKey]['count']++;
                }
            }

            // 3. Calculate percentages & sort
            foreach ($distribution as &$data) {
                $data['percent'] = round(($data['count'] / $studentCount) * 100, 2);
            }
            unset($data); // break reference

            // Optional: Sort by count desc? Or keep option order?
            // Usually Key order (A, B, C) is preferred for MC.
            // For Numerical/Essay, Count Desc is better.
            if (!$isChoiceBased) {
                uasort($distribution, fn($a, $b) => $b['count'] <=> $a['count']);
                // Limit to top 10 variants for free-text types to avoid huge DB records
                if (count($distribution) > 10) {
                    $distribution = array_slice($distribution, 0, 10, true);
                }
            } else {
                ksort($distribution); // Sort by Option Key (A, B, C...)
            }

            $item->update([
                'distractor_analysis' => $distribution
            ]);
        }
    }
}
