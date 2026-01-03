<?php

namespace App\Jobs\Analysis;

use App\Models\Exam;
use App\Models\ExamAnalysis;
use App\Models\ItemAnalysis;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class InitializeAnalysisJob implements ShouldQueue
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
        $exam = Exam::with(['examQuestions'])->findOrFail($analysis->exam_id);

        // Update status to processing (just in case)
        $analysis->update(['status' => 'processing']);

        // Create initial ItemAnalysis records
        foreach ($exam->examQuestions as $examQuestion) {
            ItemAnalysis::create([
                'exam_analysis_id' => $this->examAnalysisId,
                'exam_question_id' => $examQuestion->id,
                'question_id' => $examQuestion->question_id,
                'difficulty_index' => null,
                'discrimination_index' => null,
                'discrimination_status' => null,
                'distractor_analysis' => json_encode([]),
            ]);
        }
    }
}
