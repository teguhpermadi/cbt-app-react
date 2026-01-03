<?php

namespace App\Jobs\Analysis;

use App\Models\ExamAnalysis;
use App\Models\ExamSession;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CalculateReliabilityJob implements ShouldQueue
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

        $sessions = ExamSession::where('exam_id', $examId)
            ->where('is_finished', true)
            ->get();

        $studentCount = $sessions->count();
        if ($studentCount < 2) {
            $this->updateAnalysis($analysis, $studentCount, null, null, null, null, null);
            return;
        }

        // 1. Calculate Basic Stats (Mean, SD, Min, Max)
        $scores = $sessions->pluck('total_score');
        $averageScore = $scores->avg();
        $minScore = $scores->min();
        $maxScore = $scores->max();

        // Variance of Total Scores
        $varianceTotal = $this->calculateVariance($scores);
        $standardDeviation = sqrt($varianceTotal);

        // 2. Calculate Cronbach's Alpha
        $sessionIds = $sessions->pluck('id');

        // Fetch all details where session is in our list
        $itemScores = DB::table('exam_result_details')
            ->whereIn('exam_session_id', $sessionIds)
            ->select('exam_question_id', 'score_earned')
            ->get()
            ->groupBy('exam_question_id');

        $numberOfItems = $itemScores->count();
        $sumItemVariances = 0;

        foreach ($itemScores as $questionId => $details) {
            $qs = $details->pluck('score_earned');
            $sumItemVariances += $this->calculateVariance($qs);
        }

        $reliability = 0;
        if ($numberOfItems > 1 && $varianceTotal > 0) {
            $reliability = ($numberOfItems / ($numberOfItems - 1)) * (1 - ($sumItemVariances / $varianceTotal));
        }

        $this->updateAnalysis(
            $analysis,
            $studentCount,
            $reliability,
            $averageScore,
            $standardDeviation,
            $maxScore,
            $minScore
        );
    }

    private function calculateVariance(Collection $values)
    {
        $mean = $values->avg();
        $sumSquaredDiffs = $values->reduce(function ($carry, $item) use ($mean) {
            return $carry + pow($item - $mean, 2);
        }, 0);

        return $values->count() > 1 ? $sumSquaredDiffs / ($values->count() - 1) : 0;
    }

    private function updateAnalysis(ExamAnalysis $analysis, $count, $reliability, $avg, $sd, $max, $min)
    {
        $analysis->update([
            'student_count' => $count,
            'reliability_coefficient' => $reliability,
            'average_score' => $avg,
            'standard_deviation' => $sd,
            'highest_score' => $max,
            'lowest_score' => $min,
        ]);
    }
}
