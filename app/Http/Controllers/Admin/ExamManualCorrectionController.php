<?php

namespace App\Http\Controllers\Admin;

use App\Enums\QuestionTypeEnum;
use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\ExamResultDetail;
use App\Models\ExamSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExamManualCorrectionController extends Controller
{
    public function index(Request $request, Exam $exam)
    {
        // 1. Fetch Questions
        $questions = $exam->examQuestions()
            ->orderBy('question_number')
            ->select(['id', 'question_number', 'question_type', 'content', 'options', 'score_value', 'key_answer'])
            ->get()
            ->transform(function ($q) {
                $data = $q->toArray();
                // Normalize key_answer for single choice types
                if (in_array($q->question_type, [QuestionTypeEnum::MultipleChoice, QuestionTypeEnum::TrueFalse])) {
                    if (is_array($data['key_answer']) && !empty($data['key_answer'])) {
                        $data['key_answer'] = $data['key_answer'];
                    }
                }
                return $data;
            });

        // 2. Determine Selected Question
        $selectedQuestionId = $request->query('question_id');
        $selectedQuestion = $questions->firstWhere('id', $selectedQuestionId);

        if (!$selectedQuestion && $questions->isNotEmpty()) {
            $selectedQuestion = $questions->first();
        }

        // 3. Fetch Answers if a question is selected
        $answers = [];
        if ($selectedQuestion) {
            $sessions = ExamSession::where('exam_id', $exam->id)
                ->with(['user', 'examResultDetails' => function ($q) use ($selectedQuestion) {
                    $q->where('exam_question_id', $selectedQuestion['id']);
                }])
                ->get();

            $answers = $sessions->map(function ($session) use ($selectedQuestion) {
                // Find or Create Logic
                $detail = $session->examResultDetails->first(); // We filtered by question ID above

                if (!$detail) {
                    $detail = ExamResultDetail::create([
                        'exam_session_id' => $session->id,
                        'exam_question_id' => $selectedQuestion['id'],
                        'question_number' => $selectedQuestion['question_number'],
                        'student_answer' => null,
                        'score_earned' => 0,
                        'is_correct' => false,
                        'answered_at' => now(),
                    ]);
                }

                return [
                    'id' => $detail->id,
                    'student_name' => $session->user->name,
                    'student_email' => $session->user->email,
                    'exam_session_id' => $session->id,
                    'attempt_number' => $session->attempt_number,
                    'student_answer' => $detail->student_answer,
                    'score_earned' => $detail->score_earned,
                    'correction_notes' => $detail->correction_notes,
                    'is_correct' => $detail->is_correct,
                    'answered_at' => $detail->answered_at,
                ];
            })->values(); // ensure array keys reset
        }

        return Inertia::render('admin/exams/manual-correction', [
            'exam' => $exam,
            'questions' => $questions,
            'selectedQuestion' => $selectedQuestion,
            'answers' => $answers,
        ]);
    }

    /**
     * Helper method to determine if an option is correct based on key_answer
     */
    private function isCorrectOption($keyAnswer, $optionKey, $questionType)
    {
        if (!$keyAnswer) {
            return false;
        }

        // Handle different question types
        if (is_array($keyAnswer)) {
            // For multiple selection, ordering, matching
            return in_array($optionKey, $keyAnswer);
        }

        // For single choice, true/false
        return $keyAnswer === $optionKey;
    }

    public function storeScore(Request $request)
    {
        $validated = $request->validate([
            'detail_id' => 'required|exists:exam_result_details,id',
            'score' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $detail = ExamResultDetail::findOrFail($validated['detail_id']);

        DB::transaction(function () use ($detail, $validated) {
            $detail->update([
                'score_earned' => $validated['score'],
                'correction_notes' => $validated['notes'],
                'is_correct' => $validated['score'] > 0, // Simple heuristic, can be improved
            ]);

            // Recalculate Session Total
            // We can dispatch the existing Job, BUT the job might reset essay scores if it runs logic
            // For now, let's manually update the sum for immediate feedback + stability
            // Or better: Re-sum all details for this session

            $session = $detail->examSession;
            $newTotal = $session->examResultDetails()->sum('score_earned');
            $session->update(['total_score' => $newTotal]);

            // Update Final Result if exists
            if ($session->examResult) {
                $maxScore = $session->total_max_score > 0 ? $session->total_max_score : 1;
                $scorePercent = ($newTotal / $maxScore) * 100;

                $session->examResult->update([
                    'total_score' => $newTotal,
                    'score_percent' => $scorePercent,
                    'is_passed' => $scorePercent >= ($session->exam->passing_score ?? 0),
                ]);
            }
        });

        return response()->json(['message' => 'Score updated successfully']);
    }

    public function bulkStoreScore(Request $request)
    {
        $validated = $request->validate([
            'scores' => 'required|array',
            'scores.*.detail_id' => 'required|exists:exam_result_details,id',
            'scores.*.score' => 'required|numeric|min:0',
            'scores.*.notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['scores'] as $item) {
                $detail = ExamResultDetail::find($item['detail_id']);
                if (!$detail) continue;

                $detail->update([
                    'score_earned' => $item['score'],
                    'correction_notes' => $item['notes'] ?? null,
                    'is_correct' => $item['score'] > 0,
                ]);

                // Recalculation logic mirrors single store
                // Optimization: Group by session and recalculate once per session at the end
                // For MVP, doing it per item is acceptable if bulk size isn't massive
                $session = $detail->examSession;
                $newTotal = $session->examResultDetails()->sum('score_earned');
                $session->update(['total_score' => $newTotal]);

                if ($session->examResult) {
                    $maxScore = $session->total_max_score > 0 ? $session->total_max_score : 1;
                    $scorePercent = ($newTotal / $maxScore) * 100;

                    $session->examResult->update([
                        'total_score' => $newTotal,
                        'score_percent' => $scorePercent,
                        'is_passed' => $scorePercent >= ($session->exam->passing_score ?? 0),
                    ]);
                }
            }
        });

        return response()->json(['message' => 'Bulk scores updated successfully']);
    }
}
