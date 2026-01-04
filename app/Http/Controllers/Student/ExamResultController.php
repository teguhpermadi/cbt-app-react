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
        $masteryAnalysis = [];
        $totalQuestionsWithTags = 0;

        foreach ($session->examResultDetails as $detail) {
            $question = $detail->examQuestion;
            $originalQuestion = $question->originalQuestion;

            // Jika soal punya original question dan tags
            if ($originalQuestion && $originalQuestion->tags->isNotEmpty()) {
                foreach ($originalQuestion->tags as $tag) {
                    $tagName = $tag->name;
                    if (!isset($masteryAnalysis[$tagName])) {
                        $masteryAnalysis[$tagName] = [
                            'name' => $tagName,
                            'total_score_earned' => 0,
                            'total_max_score' => 0,
                            'question_count' => 0,
                        ];
                    }
                    $masteryAnalysis[$tagName]['total_score_earned'] += $detail->score_earned;
                    $masteryAnalysis[$tagName]['total_max_score'] += $question->score_value; // Asumsi score_value exam_question
                    $masteryAnalysis[$tagName]['question_count']++;
                }
                $totalQuestionsWithTags++;
            } else {
                // Fallback jika tidak ada tag: Masukkan ke "Umum" atau Nama Ujian
                $tagName = 'Umum';
                if (!isset($masteryAnalysis[$tagName])) {
                    $masteryAnalysis[$tagName] = [
                        'name' => $tagName,
                        'total_score_earned' => 0,
                        'total_max_score' => 0,
                        'question_count' => 0,
                    ];
                }
                $masteryAnalysis[$tagName]['total_score_earned'] += $detail->score_earned;
                $masteryAnalysis[$tagName]['total_max_score'] += $question->score_value;
                $masteryAnalysis[$tagName]['question_count']++;
            }
        }

        // Finalisasi Mastery Analysis (Hitung Persentase & Status)
        $analysisResult = [];
        foreach ($masteryAnalysis as $tag => $data) {
            $percentage = $data['total_max_score'] > 0 ? ($data['total_score_earned'] / $data['total_max_score']) * 100 : 0;

            $status = 'mastered';
            if ($percentage < 60) { // Threshold Remedial (bisa setting dinamis nanti)
                $status = 'remedial';
            } elseif ($percentage >= 85) {
                $status = 'enrichment';
            }

            $analysisResult[] = [
                'tag' => $tag,
                'score_earned' => $data['total_score_earned'],
                'max_score' => $data['total_max_score'],
                'percentage' => round($percentage, 1),
                'status' => $status,
            ];
        }

        // --- 2. Norm-Referenced Assessment & Leaderboard ---

        // Ambil semua sesi yang sudah selesai untuk ujian ini
        // Kita select columns yang ada di database saja
        $allSessions = ExamSession::where('exam_id', $exam->id)
            ->where('is_finished', true)
            ->select('user_id', 'total_score', 'total_max_score', 'duration_taken', 'finish_time', 'start_time')
            ->with('user:id,name') // Load nama user (hapus avatar karena tidak ada di DB)
            ->get();

        // Group by user untuk mengambil nilai terbaik tiap user
        $studentBestScores = $allSessions->groupBy('user_id')->map(function ($sessions) {
            // Kita sorting collection menggunakan accessor 'final_score'
            // Ambil sesi dengan skor tertinggi, jika sama ambil durasi tercepat
            return $sessions->sortByDesc('final_score')->sortBy('duration_taken')->first();
        });

        $totalStudents = $studentBestScores->count();
        $scores = $studentBestScores->pluck('final_score'); // Ini akan memanggil accessor
        $averageScore = $scores->isNotEmpty() ? $scores->avg() : 0;
        $highestScore = $scores->isNotEmpty() ? $scores->max() : 0;
        $lowestScore = $scores->isNotEmpty() ? $scores->min() : 0;

        // Ranking Helper
        $sortedStudents = $studentBestScores->values()->sortBy([
            ['final_score', 'desc'],
            ['duration_taken', 'asc']
        ])->values();

        // Warning: Comparison harus strict atau loose? 
        // user_id adalah integer, session->user_id juga integer.
        $myRank = $sortedStudents->search(function ($item) use ($session) {
            return $item->user_id === $session->user_id;
        }); // Returns index, so rank is index + 1

        $myRank = $myRank !== false ? $myRank + 1 : '-';

        // Percentile Rank: (Below / Total) * 100
        $studentsBelowMe = $scores->filter(function ($s) use ($session) {
            return $s < $session->final_score;
        })->count();

        $percentileRank = $totalStudents > 1
            ? ($studentsBelowMe / ($totalStudents - 1)) * 100
            : 100;

        // Leaderboard Top 10
        $leaderboard = $sortedStudents->take(10)->map(function ($s, $index) {
            return [
                'rank' => $index + 1,
                'name' => $s->user->name,
                // 'avatar' => $s->user->avatar, // Hapus avatar dari DB
                'score' => round($s->final_score, 1),
                'duration' => $s->duration_taken,
                'is_me' => $s->user_id === Auth::id(),
            ];
        })->values();

        $normReference = [
            'class_average' => round($averageScore, 1),
            'highest_score' => round($highestScore, 1),
            'lowest_score' => round($lowestScore, 1),
            'total_students' => $totalStudents,
            'my_rank' => $myRank,
            'percentile_rank' => round($percentileRank, 1),
        ];

        // Prepare data for result page
        $questions = $session->examResultDetails->map(function ($detail) {
            $question = $detail->examQuestion;
            return [
                'id' => $question->id,
                'number' => $detail->question_number,
                'content' => $question->content,
                'key_answer' => $question->key_answer,
                'student_answer' => $detail->student_answer,
                'is_correct' => $detail->is_correct,
                'score_earned' => $detail->score_earned,
                'max_score' => $question->score_value->value ?? 0,
                'type' => $question->question_type,
                'media_url' => $question->media_path ? asset('storage/' . $question->media_path) : null,
                'explanation' => $question->explanation ?? null,
                'options' => $question->options,
            ];
        });

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
