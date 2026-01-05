<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // 1. Data existing dashboard (stats personal)
        // Ambil ID Kelas siswa dari relasi grades
        $gradeIds = $user->grades->pluck('id');

        // Stats Personal
        $stats = [
            'completed_exams' => \App\Models\ExamSession::where('user_id', $user->id)->where('is_finished', true)->count(),
            'average_score' => round(\App\Models\ExamSession::where('user_id', $user->id)->where('is_finished', true)->avg('total_score') ?? 0, 1),
            'upcoming_exams' => Exam::whereHas('grades', function ($query) use ($gradeIds) {
                $query->whereIn('grades.id', $gradeIds);
            })
                ->where('is_published', true)
                ->where('start_time', '>', now())
                ->count(),
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

        $teacherCount = \App\Models\User::role('teacher')->count();
        $studentCount = \App\Models\User::role('student')->count();

        $examsToday = Exam::with(['subject', 'grades'])
            ->where('is_published', true)
            // Exam yang berjalan hari ini:
            // start_time <= now AND end_time >= now
            // ATAU
            // start_time hari ini
            // Asumsi "Berjalan hari ini" bisa berarti sedang aktif atau dijadwalkan hari ini.
            // Kita ambil yang sedang aktif saat ini saja agar lebih relevan.
            ->where('start_time', '<=', now())
            ->where('end_time', '>=', now())
            ->orderBy('end_time', 'asc')
            ->get();

        $leaderboard = \App\Models\ExamResult::with('user')
            ->select('user_id', \Illuminate\Support\Facades\DB::raw('SUM(score_percent) as total_points'))
            ->groupBy('user_id')
            ->orderByDesc('total_points')
            ->limit(10)
            ->get()
            ->map(function ($result) {
                return [
                    'name' => $result->user->name,
                    'username' => $result->user->username,
                    'points' => round($result->total_points),
                    'avatar_url' => $result->user->profile_photo_url ?? null, // Fallback if handled elsewhere
                ];
            });


        return Inertia::render('dashboard', [
            // Data Existing
            'stats' => $stats,
            'recentResults' => $recentResults,

            // Data Baru
            'activeAcademicYear' => $activeAcademicYear,
            'teacherCount' => $teacherCount,
            'studentCount' => $studentCount,
            'examsToday' => $examsToday,
            'leaderboard' => $leaderboard,
        ]);
    }
}
