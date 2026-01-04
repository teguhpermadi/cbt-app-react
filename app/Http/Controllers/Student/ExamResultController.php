<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ExamResultController extends Controller
{
    private $analysisService;

    public function __construct(\App\Services\ExamAnalysisService $analysisService)
    {
        $this->analysisService = $analysisService;
    }

    /**
     * Display a listing of the finished exams.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Get all finished exam sessions for the user
        // We group by exam_id to show the latest attempt or list all attempts?
        // Let's list all attempts for now, or maybe grouped by Exam.
        // User request says "menampilkan semua daftar ujian yang sudah pernah dia kerjakan".
        // Often a list of sessions is better if multiple attempts are allowed.

        $sessions = ExamSession::query()
            ->where('user_id', $user->id)
            ->where('is_finished', true)
            ->with(['exam.subject']) // Remove examResult eager load as we don't need it if using session score
            ->latest('finish_time')
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'exam_id' => $session->exam_id,
                    'exam_title' => $session->exam->title,
                    'subject' => $session->exam->subject->name ?? '-',
                    'attempt_number' => $session->attempt_number,
                    'finish_time' => $session->finish_time ? $session->finish_time->toISOString() : null,
                    'score' => $session->final_score, // Use accessor
                    'show_result' => $session->exam->show_result_on_finish,
                ];
            });

        return Inertia::render('student/exams/history', [
            'sessions' => $sessions,
        ]);
    }

    /**
     * Display the specified exam result (Latest session for this exam).
     */
    public function show(Exam $exam)
    {
        // Check if exam allows showing results
        if (!$exam->show_result_on_finish) {
            return redirect()->route('student.results.index')->with('error', 'Hasil ujian ini tidak dapat dilihat.');
        }

        $session = ExamSession::where('exam_id', $exam->id)
            ->where('user_id', Auth::id())
            ->where('is_finished', true)
            ->latest('finish_time')
            ->firstOrFail();

        return $this->showSession($session);
    }

    /**
     * Display a specific exam session result.
     */
    public function showSession(ExamSession $session)
    {
        // Authorization: Ensure session belongs to user
        if ($session->user_id !== Auth::id()) {
            abort(403);
        }

        $exam = $session->exam;

        if (!$exam->show_result_on_finish) {
            return redirect()->route('student.results.index')->with('error', 'Hasil ujian ini tidak dapat dilihat.');
        }

        // Load necessary relations for result display
        $session->load(['examResultDetails.examQuestion.originalQuestion.tags', 'user']);

        // --- 1. Masteri Materi (Criterion-Referenced) ---
        $analysisResult = $this->analysisService->calculateMasteryAnalysis($session);

        // --- 2. Norm-Referenced Assessment & Leaderboard ---
        $normReference = $this->analysisService->calculateNormReference($exam, $session);
        $leaderboard = $this->analysisService->getLeaderboard($exam, Auth::id());

        // Prepare data for result page
        $questions = $this->analysisService->getFormattedQuestions($session);

        // Use getFinalScoreAttribute from ExamSession model which calculates percentage
        $totalScore = $session->final_score;

        return Inertia::render('student/exams/result', [
            'exam' => $exam,
            'session' => $session,
            'questions' => $questions,
            'total_score' => $totalScore,
            'analysis' => $analysisResult,
            'norm_reference' => $normReference,
            'leaderboard' => $leaderboard,
        ]);
    }
}
