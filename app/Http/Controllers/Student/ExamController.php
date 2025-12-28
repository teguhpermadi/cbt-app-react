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
            'student' => \Illuminate\Support\Facades\Auth::user(),
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

        // 2. Load necessary relations
        $user = $request->user();

        // 3. Check for existing unfinished session
        $existingSession = \App\Models\ExamSession::where('exam_id', $exam->id)
            ->where('user_id', $user->id)
            ->where('is_finished', false)
            ->first();

        if ($existingSession) {
            return redirect()->route('student.exams.take', $exam->id);
        }

        // 4. Create Snapshot if strictly necessary (Lazy Loading)
        // Check if exam_questions already exist for this exam
        if ($exam->examQuestions()->doesntExist()) {
            $questions = $exam->questionBank->questions()->orderBy('order')->get();

            foreach ($questions as $index => $question) {
                \App\Models\ExamQuestion::create([
                    'exam_id' => $exam->id,
                    'question_id' => $question->id,
                    'question_number' => $index + 1, // Urutan default dari bank soal
                    'content' => $question->content,
                    'options' => $question->getOptionsForExam(),
                    'key_answer' => $question->getKeyAnswerForExam(),
                    'score_value' => $question->score_value->value, // Assuming enum value logic
                    'question_type' => $question->question_type,
                    'difficulty_level' => $question->difficulty_level,
                ]);
            }
        }

        // 5. Create New Session
        $session = \App\Models\ExamSession::create([
            'exam_id' => $exam->id,
            'user_id' => $user->id,
            'start_time' => now(),
            'attempt_number' => 1, // Logic for multiple attempts can be added here
            'is_finished' => false,
            'ip_address' => $request->ip(),
        ]);

        // 6. Seed ExamResultDetails (Questions for this session)
        $examQuestions = $exam->examQuestions()->get();

        if ($exam->is_randomized) {
            $examQuestions = $examQuestions->shuffle();
        } else {
            $examQuestions = $examQuestions->sortBy('question_number');
        }

        $details = [];
        $order = 1;
        foreach ($examQuestions as $eq) {
            $details[] = [
                'id' => (string) \Illuminate\Support\Str::ulid(), // Manual ULID generation for mass insert
                'exam_session_id' => $session->id,
                'exam_question_id' => $eq->id,
                'question_number' => $order++,
                'score_earned' => 0,
                'is_correct' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        \App\Models\ExamResultDetail::insert($details);

        return redirect()->route('student.exams.take', $exam->id)->with('success', 'Ujian dimulai!');
    }

    public function take(Exam $exam)
    {
        $user = \Illuminate\Support\Facades\Auth::user();

        $session = \App\Models\ExamSession::where('exam_id', $exam->id)
            ->where('user_id', $user->id)
            ->where('is_finished', false)
            ->firstOrFail();

        // Calculate remaining time
        $now = now();
        $startTime = $session->start_time;
        $endTime = $startTime->copy()->addMinutes($exam->duration);

        // If hard end_time of exam is earlier than calculated end time, use that
        if ($exam->end_time < $endTime) {
            $endTime = $exam->end_time;
        }

        $remainingSeconds = $now->diffInSeconds($endTime, false);

        if ($remainingSeconds <= 0) {
            // Auto finish if time is up (logic to be added)
            // For now just redirect or show message
        }

        // Fetch questions ordered by 'question_number' persisted in ExamResultDetail
        // We join with exam_questions to get the content snapshot
        $questions = \App\Models\ExamResultDetail::where('exam_session_id', $session->id)
            ->join('exam_questions', 'exam_result_details.exam_question_id', '=', 'exam_questions.id')
            ->select(
                'exam_result_details.id as detail_id',
                'exam_result_details.student_answer',
                'exam_result_details.question_number',
                'exam_result_details.is_flagged',
                'exam_questions.id as question_id',
                'exam_questions.content',
                'exam_questions.options',
                'exam_questions.question_type',
                'exam_questions.question_number as original_number'
            )
            ->orderBy('exam_result_details.question_number')
            ->get()
            ->map(function ($q) {
                return [
                    'id' => $q->question_id, // This is the ExamQuestion ID
                    'detail_id' => $q->detail_id,
                    'number' => $q->question_number,
                    'content' => $q->content,
                    'type' => $q->question_type,
                    'options' => json_decode($q->options ?? '[]'), // Ensure it's decoded
                    'student_answer' => $q->student_answer,
                    'is_flagged' => (bool) $q->is_flagged,
                ];
            });

        return Inertia::render('student/exams/take', [
            'exam' => $exam,
            'session' => [
                'id' => $session->id,
                'end_time' => $endTime->toISOString(),
            ],
            'questions' => $questions,
        ]);
    }

    public function saveAnswer(Request $request, Exam $exam)
    {
        $request->validate([
            'detail_id' => 'required|exists:exam_result_details,id',
            'duration' => 'required|numeric|min:0', // Duration in seconds
            'is_flagged' => 'nullable|boolean',
            // Answer can be null/mixed depending on type
        ]);

        $detail = \App\Models\ExamResultDetail::findOrFail($request->detail_id);

        // Security check: ensure this detail belongs to current user's active session
        if ($detail->examSession->user_id !== \Illuminate\Support\Facades\Auth::id()) {
            abort(403);
        }

        $updateData = [
            'time_spent' => \Illuminate\Support\Facades\DB::raw("time_spent + " . (int)$request->duration),
        ];

        if ($request->has('answer')) {
            $updateData['student_answer'] = $request->answer;
            $updateData['answered_at'] = now();
        }

        if ($request->has('is_flagged')) {
            $updateData['is_flagged'] = $request->is_flagged;
        }

        $detail->update($updateData);

        return response()->json(['success' => true]);
    }

    public function finish(Exam $exam)
    {
        $session = \App\Models\ExamSession::where('exam_id', $exam->id)
            ->where('user_id', \Illuminate\Support\Facades\Auth::id())
            ->where('is_finished', false)
            ->firstOrFail();

        $session->update([
            'is_finished' => true,
            'end_time' => now(),
        ]);

        return redirect()->route('student.exams.index')->with('success', 'Ujian telah selesai dikumpulkan.');
    }
}
