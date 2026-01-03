<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\Analysis\CalculateDifficultyJob;
use App\Jobs\Analysis\CalculateDiscriminationJob;
use App\Jobs\Analysis\CalculateDistractorJob;
use App\Jobs\Analysis\CalculateReliabilityJob;
use App\Jobs\Analysis\FinishAnalysisJob;
use App\Jobs\Analysis\InitializeAnalysisJob;
use App\Models\Exam;
use App\Models\ExamAnalysis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Inertia\Inertia;

class ExamAnalysisController extends Controller
{
    public function store(Request $request, Exam $exam)
    {
        // Delete existing analysis to avoid duplicates
        ExamAnalysis::where('exam_id', $exam->id)->delete();

        // Create a new analysis record
        $analysis = ExamAnalysis::create([
            'exam_id' => $exam->id,
            'status' => 'processing',
        ]);

        $batch = Bus::batch([
            new InitializeAnalysisJob($analysis->id),
            [
                new CalculateReliabilityJob($analysis->id),
                new CalculateDifficultyJob($analysis->id),
                new CalculateDiscriminationJob($analysis->id),
                new CalculateDistractorJob($analysis->id),
            ],
            new FinishAnalysisJob($analysis->id),
        ])->name("Exam Analysis: {$exam->title}")->dispatch();

        return redirect()->back()->with('success', 'Analisis butir soal sedang diproses. Silakan cek kembali beberapa saat lagi.');
    }

    public function show(Exam $exam)
    {
        // Load latest analysis
        $analysis = ExamAnalysis::where('exam_id', $exam->id)
            ->with(['itemAnalyses.examQuestion']) // Eager load for table
            ->latest()
            ->first();

        return Inertia::render('admin/exams/analysis/index', [
            'exam' => $exam,
            'analysis' => $analysis,
        ]);
    }
}
