<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // 1. Data existing dashboard (stats personal)
        // Ambil ID Kelas siswa dari relasi grades
        $gradeIds = $user->grades->pluck('id');

        // Stats Personal
        $completedExamsCount = \App\Models\ExamSession::where('user_id', $user->id)->where('is_finished', true)->count();
        // Uses ExamResult score_percent for accuracy
        $averageScore = round(\App\Models\ExamResult::where('user_id', $user->id)->avg('score_percent') ?? 0, 1);

        $upcomingExamsCount = \App\Models\Exam::whereHas('grades', function ($query) use ($gradeIds) {
            $query->whereIn('grades.id', $gradeIds);
        })
            ->where('is_published', true)
            ->where('start_time', '>', now())
            ->count();

        // NEW: Total Final Score (Sum of score_percent from ExamResult)
        $totalFinalScore = round(\App\Models\ExamResult::where('user_id', $user->id)->sum('score_percent'));

        $stats = [
            'completed_exams' => $completedExamsCount,
            'average_score' => $averageScore,
            'upcoming_exams' => $upcomingExamsCount,
            'total_score' => $totalFinalScore,
        ];

        // Riwayat Hasil Terakhir
        $recentResults = \App\Models\ExamSession::with(['exam.subject'])
            ->where('user_id', $user->id)
            ->where('is_finished', true)
            ->orderBy('finish_time', 'desc')
            ->limit(5)
            ->get();

        // 2. Data Baru untuk Card Informatif & Leaderboard
        $activeAcademicYear = \App\Models\AcademicYear::active()->first();

        // Exams Today (Exam yang berjalan hari ini / saat ini)
        $examsToday = \App\Models\Exam::with(['subject', 'grades'])
            ->where('is_published', true)
            ->where('start_time', '<=', now())
            ->where('end_time', '>=', now())
            ->whereHas('grades', function ($query) use ($gradeIds) {
                $query->whereIn('grades.id', $gradeIds);
            }) // Filter only exams for student's grade
            ->orderBy('end_time', 'asc')
            ->get()
            ->map(function ($exam) use ($user) {
                // Check if user has started
                $session = \App\Models\ExamSession::where('exam_id', $exam->id)
                    ->where('user_id', $user->id)
                    ->first();

                // Logic tambahan: Kalau sudah finished, jangan tampilkan di active exams?
                if ($session && $session->is_finished) {
                    return null;
                }

                $exam->has_started = $session ? true : false;
                return $exam;
            })
            ->filter()
            ->values();

        // LEADERBOARD LOGIC
        // 1. Get all students in the same grades as the current user
        $classmateIds = \App\Models\User::role('student')
            ->whereHas('grades', function ($query) use ($gradeIds) {
                $query->whereIn('grades.id', $gradeIds);
            })
            ->pluck('id');

        // 2. Calculate total points for each classmate
        $allLeaderboardData = \App\Models\ExamResult::with('user')
            ->whereIn('user_id', $classmateIds)
            ->select('user_id', \Illuminate\Support\Facades\DB::raw('SUM(score_percent) as total_points'))
            ->groupBy('user_id')
            ->orderByDesc('total_points')
            ->get();

        // 3. Map to array with rank
        $rankedData = $allLeaderboardData->map(function ($result, $index) use ($user) {
            return [
                'rank' => $index + 1,
                'user_id' => $result->user_id,
                'name' => $result->user ? $result->user->name : 'Unknown',
                'username' => $result->user ? $result->user->username : 'Unknown',
                'points' => round($result->total_points),
                'avatar_url' => $result->user->profile_photo_url ?? null,
                'is_me' => $result->user_id === $user->id,
            ];
        });

        // 4. Find current user's index
        $userIndex = $rankedData->search(function ($item) use ($user) {
            return $item['user_id'] === $user->id;
        });

        // 5. Select indices to display
        $indicesToShow = collect([]);
        $totalCount = $rankedData->count();

        // Top 3
        for ($i = 0; $i < min(3, $totalCount); $i++) {
            $indicesToShow->push($i);
        }

        // Neighbors (UserIndex - 2 to UserIndex + 2)
        if ($userIndex !== false) {
            for ($i = max(0, $userIndex - 2); $i <= min($totalCount - 1, $userIndex + 2); $i++) {
                $indicesToShow->push($i);
            }
        }

        // Bottom 2
        for ($i = max(0, $totalCount - 2); $i < $totalCount; $i++) {
            $indicesToShow->push($i);
        }

        // 6. Filter, Unique, Sort, and Re-values
        $leaderboard = $rankedData->filter(function ($item, $key) use ($indicesToShow) {
            return $indicesToShow->contains($key);
        })->unique('rank')->sortBy('rank')->values();

        return Inertia::render('student/dashboard', [
            'stats' => $stats,
            'recentResults' => $recentResults,

            // Data Baru
            'activeAcademicYear' => $activeAcademicYear,
            'examsToday' => $examsToday,
            'leaderboard' => $leaderboard,
        ]);
    }
}
