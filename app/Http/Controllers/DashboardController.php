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

        // Ambil ID Kelas siswa dari relasi grades
        $gradeIds = $user->grades()->pluck('grades.id');

        // 1. Ujian Aktif: Ujian untuk kelas siswa yang sudah dipublikasikan dan masih dalam rentang waktu
        $activeExams = Exam::with(['subject', 'grade'])
            ->whereIn('grade_id', $gradeIds)
            ->where('is_published', true)
            ->where('end_time', '>=', now())
            ->orderBy('start_time', 'asc')
            ->get()
            ->map(function ($exam) use ($user) {
                // Cek apakah siswa sudah punya sesi pengerjaan untuk ujian ini
                $exam->has_started = ExamSession::where('exam_id', $exam->id)
                    ->where('user_id', $user->id)
                    ->exists();
                
                return $exam;
            });

        // 2. Statistik Singkat
        $stats = [
            'completed_exams' => ExamSession::where('user_id', $user->id)->where('is_finished', true)->count(),
            'average_score' => round(ExamSession::where('user_id', $user->id)->where('is_finished', true)->avg('total_score') ?? 0, 1),
            'upcoming_exams' => Exam::whereIn('grade_id', $gradeIds)
                ->where('is_published', true)
                ->where('start_time', '>', now())
                ->count(),
        ];

        // 3. Riwayat Hasil Terakhir
        $recentResults = ExamSession::with(['exam.subject'])
            ->where('user_id', $user->id)
            ->where('is_finished', true)
            ->orderBy('finish_time', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'activeExams' => $activeExams,
            'stats' => $stats,
            'recentResults' => $recentResults,
        ]);
    }
}
