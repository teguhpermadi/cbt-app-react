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

class CalculateDiscriminationJob implements ShouldQueue
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

        $sortedSessions = ExamSession::where('exam_id', $examId)
            ->where('is_finished', true)
            ->orderBy('total_score', 'desc')
            ->pluck('id');

        $studentCount = $sortedSessions->count();

        if ($studentCount < 2) {
            return;
        }

        // Determine group size (27%)
        $n = ceil($studentCount * 0.27);
        // Ensure standard comparison groups (at least 1 per group?)
        // If n < 1 (e.g. 2 students * 0.27 = 0.54 -> 1), it works.

        $upperGroupIds = $sortedSessions->take($n);
        $lowerGroupIds = $sortedSessions->take(-$n); // take negative n from end

        // Count Correct Upper
        $upperCorrectCounts = DB::table('exam_result_details')
            ->whereIn('exam_session_id', $upperGroupIds)
            ->where('is_correct', true)
            ->select('exam_question_id', DB::raw('count(*) as correct_count'))
            ->groupBy('exam_question_id')
            ->pluck('correct_count', 'exam_question_id');

        // Count Correct Lower
        $lowerCorrectCounts = DB::table('exam_result_details')
            ->whereIn('exam_session_id', $lowerGroupIds)
            ->where('is_correct', true)
            ->select('exam_question_id', DB::raw('count(*) as correct_count'))
            ->groupBy('exam_question_id')
            ->pluck('correct_count', 'exam_question_id');

        $items = ItemAnalysis::where('exam_analysis_id', $this->examAnalysisId)->get();

        foreach ($items as $item) {
            $upper = $upperCorrectCounts->get($item->exam_question_id, 0);
            $lower = $lowerCorrectCounts->get($item->exam_question_id, 0);

            $d = ($upper - $lower) / $n;

            $status = $this->getDiscriminationStatus($d);

            $item->update([
                'discrimination_index' => round($d, 4),
                'discrimination_status' => $status
            ]);
        }
    }

    private function getDiscriminationStatus($d)
    {
        if ($d >= 0.40) return 'Very Good';
        if ($d >= 0.30) return 'Good';
        if ($d >= 0.20) return 'Fair';
        return 'Poor';
    }
}
