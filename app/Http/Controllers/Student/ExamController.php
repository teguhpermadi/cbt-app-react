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

        $exams = Exam::query()
            ->where('grade_id', $activeGrade->id)
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

        return Inertia::render('Student/Exam/Index', [
            'exams' => $exams,
        ]);
    }
}
