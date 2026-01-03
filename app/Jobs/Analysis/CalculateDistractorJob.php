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

        $items = ItemAnalysis::with(['examQuestion', 'examQuestion.originalQuestion'])
            ->where('exam_analysis_id', $this->examAnalysisId)
            ->get();

        foreach ($items as $item) {
            $examQuestion = $item->examQuestion;

            // Only analyze distractors for Multiple Choice
            if ($examQuestion->question_type !== QuestionTypeEnum::MultipleChoice) {
                continue;
            }

            // Get answers for this question
            $details = DB::table('exam_result_details')
                ->where('exam_question_id', $examQuestion->id)
                ->whereIn('exam_session_id', $sessionIds)
                ->select('student_answer', 'is_correct')
                ->get();

            // Structure: Key => { count, percent, is_key }
            $distribution = [];

            // Initialize with known options if possible
            // We can look at examQuestion->options 
            $options = $examQuestion->options; // This is an array cast
            $keyAnswer = $examQuestion->key_answer['answer'] ?? null;

            if (is_array($options)) {
                foreach ($options as $opt) {
                    $key = $opt['key'] ?? $opt['option_key'] ?? null;
                    if ($key) {
                        $distribution[$key] = [
                            'count' => 0,
                            'percent' => 0,
                            'is_key' => ($key == $keyAnswer)
                        ];
                    }
                }
            }

            foreach ($details as $detail) {
                $answerData = json_decode($detail->student_answer, true);
                $answerKey = $answerData['answer'] ?? null;

                if ($answerKey) {
                    if (!isset($distribution[$answerKey])) {
                        $distribution[$answerKey] = [
                            'count' => 0,
                            'percent' => 0,
                            'is_key' => ($answerKey == $keyAnswer)
                        ];
                    }
                    $distribution[$answerKey]['count']++;
                }
            }

            // Calculate percentages
            foreach ($distribution as &$data) {
                $data['percent'] = round(($data['count'] / $studentCount) * 100, 2);
            }

            $item->update([
                'distractor_analysis' => $distribution
            ]);
        }
    }
}
