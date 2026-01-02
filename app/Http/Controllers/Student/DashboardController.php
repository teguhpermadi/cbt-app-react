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

        // Ambil ujian aktif yang sesuai dengan grade siswa
        // Relasi Exam -> Grade adalah Many-to-Many
        // Siswa -> Grade juga Many-to-Many (asumsi siswa bisa punya >1 grade, misal akselerasi atau pindah)
        // Kita cari Exam yang punya setidaknya satu grade yang sama dengan grade siswa.

        $studentGradeIds = $user->grades->pluck('id');

        $activeExams = \App\Models\Exam::query()
            ->where('is_published', true)
            // ->where('start_time', '<=', now()) // Optional: jika ingin menyembunyikan yg belum mulai
            ->where('end_time', '>', now())
            ->whereHas('grades', function ($query) use ($studentGradeIds) {
                $query->whereIn('grades.id', $studentGradeIds);
            })
            ->with(['subject', 'grades'])
            ->latest('start_time')
            ->get()
            ->map(function ($exam) use ($user) {
                // Check if user has started
                $session = \App\Models\ExamSession::where('exam_id', $exam->id)
                    ->where('user_id', $user->id)
                    ->first();

                // Jika sudah selesai, mungkin tidak perlu muncul di "Active Exams"? 
                // Atau tetap muncul tapi statusnya selesai?
                // Mockup sebelumnya: 'has_started' => boolean.

                // Logic tambahan: Kalau sudah finished, jangan tampilkan di active exams?
                if ($session && $session->is_finished) {
                    return null;
                }

                return [
                    'id' => $exam->id,
                    'title' => $exam->title,
                    'subject' => $exam->subject->name,
                    'grade' => $exam->grades->pluck('name')->join(', '),
                    'duration' => $exam->duration,
                    'end_time' => $exam->end_time,
                    'has_started' => $session ? true : false,
                ];
            })
            ->filter() // Hapus yang null (finished exams)
            ->values();

        $recentResults = \App\Models\ExamSession::query()
            ->with(['exam.subject'])
            ->where('user_id', $user->id)
            ->where('is_finished', true)
            ->latest('finish_time')
            ->take(5)
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id, // Session ID for detail view
                    'title' => $session->exam->title,
                    'subject' => $session->exam->subject->name,
                    // Pastikan model ExamSession memiliki accessor final_score atau hitung manual
                    'score' => $session->final_score ?? 0,
                    'date' => $session->finish_time,
                ];
            });

        return Inertia::render('student/dashboard', [
            'activeExams' => $activeExams,
            'recentResults' => $recentResults,
        ]);
    }
}
