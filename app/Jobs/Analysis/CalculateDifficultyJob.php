<?php

namespace App\Jobs\Analysis;

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

class CalculateDifficultyJob implements ShouldQueue
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

        if ($studentCount == 0) {
            return;
        }

        // Count correct answers per question
        $correctCounts = DB::table('exam_result_details')
            ->whereIn('exam_session_id', $sessionIds)
            ->where('is_correct', true)
            ->select('exam_question_id', DB::raw('count(*) as correct_count'))
            ->groupBy('exam_question_id')
            ->pluck('correct_count', 'exam_question_id');

        // Iterate through all item analyses and update
        $items = ItemAnalysis::where('exam_analysis_id', $this->examAnalysisId)->get();

        foreach ($items as $item) {
            $correct = $correctCounts->get($item->exam_question_id, 0);
            $p = $correct / $studentCount;

            $item->update([
                'difficulty_index' => round($p, 4)
            ]);
        }
    }
}
