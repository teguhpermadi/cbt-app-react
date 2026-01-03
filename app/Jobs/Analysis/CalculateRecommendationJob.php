<?php

namespace App\Jobs\Analysis;

use App\Models\ItemAnalysis;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CalculateRecommendationJob implements ShouldQueue
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

        $items = ItemAnalysis::where('exam_analysis_id', $this->examAnalysisId)->get();

        foreach ($items as $item) {
            $p = $item->difficulty_index;
            $d = $item->discrimination_index;

            $recommendations = [];

            // 1. Difficulty Recommendation
            if ($p !== null) {
                if ($p > 0.7) {
                    $recommendations[] = "Soal terlalu mudah.";
                } elseif ($p < 0.3) {
                    $recommendations[] = "Soal terlalu sukar.";
                } else {
                    $recommendations[] = "Tingkat kesulitan ideal.";
                }
            }

            // 2. Discrimination Recommendation
            if ($d !== null) {
                if ($d >= 0.4) {
                    $recommendations[] = "Daya beda sangat baik.";
                } elseif ($d >= 0.3) {
                    $recommendations[] = "Daya beda baik.";
                } elseif ($d >= 0.2) {
                    $recommendations[] = "Daya beda cukup, perlu revisi minor.";
                } else {
                    $recommendations[] = "Daya beda buruk, sebaiknya soal dibuang atau direvisi total.";
                }
            }

            // 3. Distractor Efficiency (Simplified)
            // Check if any distractor is chosen by 0 students (only for MC)
            // We can check 'distractor_analysis' JSON
            $distractors = $item->distractor_analysis;
            $ineffectiveDistractors = [];
            if (is_array($distractors)) {
                foreach ($distractors as $key => $data) {
                    if (!$data['is_key'] && $data['count'] == 0) {
                        $ineffectiveDistractors[] = $key;
                    }
                }
            }

            if (!empty($ineffectiveDistractors)) {
                $recommendations[] = "Pengecoh " . implode(', ', $ineffectiveDistractors) . " tidak efektif (0 pemilih).";
            }

            $recommendationText = implode(" ", $recommendations);

            $item->update([
                'analysis_recommendation' => $recommendationText
            ]);
        }
    }
}
