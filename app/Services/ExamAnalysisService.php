<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\ExamSession;
use Illuminate\Support\Facades\Auth;

class ExamAnalysisService
{
    /**
     * Calculate mastery analysis based on tags.
     */
    public function calculateMasteryAnalysis(ExamSession $session, Exam $exam): array
    {
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

        // Get passing score from exam, default to 60 if not set
        $passingScore = $exam->passing_score ?? 60;

        // Calculate dynamic thresholds based on passing_score
        // Remedial: Below passing score
        // Sufficient: passing_score to passing_score + 14
        // Mastered: passing_score + 15 to 84
        // Enrichment: 85 and above
        $sufficientThreshold = min($passingScore + 15, 75);
        $masteredThreshold = 85;

        foreach ($masteryAnalysis as $tag => $data) {
            $percentage = $data['total_max_score'] > 0 ? ($data['total_score_earned'] / $data['total_max_score']) * 100 : 0;

            // Determine status based on dynamic thresholds
            if ($percentage < $passingScore) {
                $status = 'remedial';           // Below passing score - Perlu Remedial
            } elseif ($percentage < $sufficientThreshold) {
                $status = 'sufficient';         // Passing to sufficient threshold - Cukup
            } elseif ($percentage < $masteredThreshold) {
                $status = 'mastered';           // Sufficient to mastered threshold - Kompeten
            } else {
                $status = 'enrichment';         // >= 85% - Sangat Kompeten
            }

            $analysisResult[] = [
                'tag' => $tag,
                'score_earned' => $data['total_score_earned'],
                'max_score' => $data['total_max_score'],
                'percentage' => round($percentage, 1),
                'status' => $status,
            ];
        }

        return $analysisResult;
    }

    /**
     * Calculate Norm-Referenced Assessment statistics.
     */
    public function calculateNormReference(Exam $exam, ExamSession $session): array
    {
        // Ambil semua sesi yang sudah selesai untuk ujian ini
        $allSessions = ExamSession::where('exam_id', $exam->id)
            ->where('is_finished', true)
            ->select('user_id', 'total_score', 'total_max_score', 'duration_taken', 'finish_time', 'start_time')
            ->with('user:id,name')
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

        return [
            'class_average' => round($averageScore, 1),
            'highest_score' => round($highestScore, 1),
            'lowest_score' => round($lowestScore, 1),
            'total_students' => $totalStudents,
            'my_rank' => $myRank,
            'percentile_rank' => round($percentileRank, 1),
        ];
    }

    /**
     * Get the leaderboard for the exam.
     */
    public function getLeaderboard(Exam $exam, string|int|null $currentUserId = null): array
    {
        $allSessions = ExamSession::where('exam_id', $exam->id)
            ->where('is_finished', true)
            ->select('user_id', 'total_score', 'total_max_score', 'duration_taken', 'finish_time', 'start_time')
            ->with('user:id,name')
            ->get();

        $studentBestScores = $allSessions->groupBy('user_id')->map(function ($sessions) {
            return $sessions->sortByDesc('final_score')->sortBy('duration_taken')->first();
        });

        $sortedStudents = $studentBestScores->values()->sortBy([
            ['final_score', 'desc'],
            ['duration_taken', 'asc']
        ])->values();

        return $sortedStudents->take(10)->map(function ($s, $index) use ($currentUserId) {
            return [
                'rank' => $index + 1,
                'name' => $s->user->name,
                'score' => round($s->final_score, 1),
                'duration' => $s->duration_taken,
                'is_me' => $currentUserId ? ($s->user_id === $currentUserId) : false,
            ];
        })->values()->toArray();
    }

    /**
     * Map exam questions to a standard format for the frontend.
     */
    public function getFormattedQuestions(ExamSession $session): array
    {
        return $session->examResultDetails->map(function ($detail) {
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
                'correction_notes' => $detail->correction_notes,
            ];
        })->toArray();
    }
}
