<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Ambil kelas aktif siswa
        // Asumsi relasi grades() di User model sudah ada dan pivot table grade_user memiliki kolom is_active
        $activeGrade = $user->grades()
            ->wherePivot('is_active', true)
            ->first();

        if (!$activeGrade) {
            return Inertia::render('Student/Exam/Index', [
                'exams' => [],
                'message' => 'Anda tidak terdaftar di kelas aktif manapun.',
            ]);
        }

        $now = now();

        $exams = $activeGrade->exams()
            ->where('is_published', true)
            ->where('start_time', '<=', $now)
            ->where('end_time', '>=', $now)
            // Filter ujian yang sudah selesai dikerjakan (ExamSession is_finished = true)
            ->whereDoesntHave('examSessions', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->where('is_finished', true);
            })
            // Load relasi session user untuk cek status progress
            ->with(['examSessions' => function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->latest(); // Ambil sesi terakhir
            }, 'subject', 'grade'])
            ->get()
            ->map(function ($exam) {
                $latestSession = $exam->examSessions->first();
                $hasStarted = $latestSession ? true : false;

                return [
                    'id' => $exam->id,
                    'title' => $exam->title,
                    'subject' => $exam->subject->name ?? '-',
                    'grade' => $exam->grade->name ?? '-',
                    'duration' => $exam->duration,
                    'endTime' => $exam->end_time->toISOString(), // Kirim format ISO untuk JS
                    'hasStarted' => $hasStarted,
                ];
            });

        return Inertia::render('student/exams/index', [
            'exams' => $exams,
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(Exam $exam)
    {
        $exam->load(['subject', 'grade', 'teacher']);

        return Inertia::render('student/exams/show', [
            'exam' => $exam,
            'student' => auth()->user(),
        ]);
    }

    /**
     * Validate token and start the exam.
     */
    public function start(Request $request, Exam $exam)
    {
        // 1. Validasi Token jika token tidak visible
        if (!$exam->is_token_visible) {
            $request->validate([
                'token' => 'required|string',
            ]);

            if ($request->token !== $exam->token) {
                return back()->withErrors(['token' => 'Token ujian tidak valid.']);
            }
        }

        // 2. Cek apakah user sudah punya sesi ujian yang belum selesai
        // Logic ini bisa dikembangkan nanti untuk redirect ke halaman ujian

        // Sementara return success atau redirect ke halaman soal (belum dibuat)
        return redirect()->back()->with('success', 'Token valid! Ujian akan segera dimulai...');
    }
}
