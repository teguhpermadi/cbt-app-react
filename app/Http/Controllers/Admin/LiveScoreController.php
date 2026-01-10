<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamSession;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LiveScoreController extends Controller
{
    public function index(Exam $exam)
    {
        // Load initial data for all active sessions
        $sessions = ExamSession::with(['user'])
            ->where('exam_id', $exam->id)
            ->where('is_finished', false) // Only active sessions? Or all? User said "sedang mengerjakan" (currently working), but usually we want to see all.
            // Let's show all for now, maybe filter by finished status in frontend if needed.
            // Actually "Live Score" usually implies ongoing.
            ->get()
            ->map(function ($session) {
                // Calculate stats efficiently
                // Use a subquery or eager load with aggregation if performance is an issue.
                // For now, lazy load details count.

                // Aggregate stats
                // We could optimize this by adding columns to exam_sessions or using raw query.
                // For MVP, lets use the relation.

                $details = $session->examResultDetails;

                $totalQuestions = $details->count();
                $totalAnswered = $details->whereNotNull('answered_at')->count();
                $totalCorrect = $details->where('is_correct', true)->count();
                $totalWrong = $details->where('is_correct', false)->whereNotNull('answered_at')->count();
                $score = $details->sum('score_earned');

                $duration = 0;
                if ($session->start_time) {
                    $duration = now()->diffInSeconds($session->start_time);
                }

                return [
                    'id' => $session->id, // Session ID
                    'user_id' => $session->user_id,
                    'student_name' => $session->user->name ?? 'Unknown',
                    'student_email' => $session->user->email ?? '',
                    'correct_count' => $totalCorrect,
                    'wrong_count' => $totalWrong,
                    'total_answered' => $totalAnswered,
                    'total_questions' => $totalQuestions,
                    'duration_seconds' => $duration,
                    'score_current' => $score,
                    'is_finished' => (bool)$session->is_finished,
                    'start_time' => $session->start_time ? $session->start_time->toISOString() : null,
                ];
            });

        return Inertia::render('admin/exams/live_score', [
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'timer_type' => $exam->timer_type, // Enum value or instance
                'duration' => $exam->duration, // Minutes
            ],
            'initialStudents' => $sessions,
        ]);
    }
}
