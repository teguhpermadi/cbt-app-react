<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ExamTypeEnum;
use App\Enums\TimerTypeEnum;
use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Exam;
use App\Models\Grade;
use App\Models\QuestionBank;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ExamController extends Controller
{
    private $analysisService;

    public function __construct(\App\Services\ExamAnalysisService $analysisService)
    {
        $this->analysisService = $analysisService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $exams = Exam::with(['academicYear', 'grades', 'subject', 'teacher'])
            ->latest()
            ->paginate(10);

        $academicYears = AcademicYear::active()->get();
        $grades = Grade::all();
        $subjects = Subject::all();
        $teachers = User::where('user_type', 'teacher')->get(); // Assuming 'teacher' user_type
        $questionBanks = QuestionBank::all();

        return Inertia::render('admin/exams/index', [
            'exams' => $exams,
            'academicYears' => $academicYears,
            'grades' => $grades,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'examTypes' => ExamTypeEnum::cases(),
            'timerTypes' => TimerTypeEnum::cases(),
            'questionBanks' => $questionBanks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $academicYears = AcademicYear::active()->get();
        $grades = Grade::all();
        $subjects = Subject::all();
        $teachers = User::where('user_type', 'teacher')->get();
        $questionBanks = QuestionBank::all();

        return response()->json([
            'academicYears' => $academicYears,
            'grades' => $grades,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'examTypes' => array_map(fn($case) => $case->value, ExamTypeEnum::cases()),
            'timerTypes' => array_map(fn($case) => [
                'value' => $case->value,
                'label' => $case->getLabel(),
                'description' => $case->getDescription(),
            ], TimerTypeEnum::cases()),
            'questionBanks' => $questionBanks,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->validateExam($request);

        $data = $request->except('grade_ids');
        $data['token'] = Exam::generateToken();
        $exam = Exam::create($data);

        $exam->grades()->sync($request->input('grade_ids', []));

        // Return redirect with exam data so frontend can redirect to monitor
        return redirect()->back()->with([
            'success' => 'Exam created successfully.',
            'exam' => $exam
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Exam $exam)
    {
        $exam->load(['academicYear', 'grades', 'subject', 'teacher', 'questionBank']);

        $academicYears = AcademicYear::active()->get();
        $grades = Grade::all();
        $subjects = Subject::all();
        $teachers = User::where('user_type', 'teacher')->get();
        $questionBanks = QuestionBank::all();

        return Inertia::render('admin/exams/edit', [
            'exam' => $exam,
            'academicYears' => $academicYears,
            'grades' => $grades,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'examTypes' => ExamTypeEnum::cases(),
            'timerTypes' => TimerTypeEnum::cases(),
            'questionBanks' => $questionBanks,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Exam $exam)
    {
        // Custom validation inside update since validateExam is shared but might need tweaks
        // Actually, let's reuse validateExam but we need to handle extraction of grade_ids after validation

        $validated = $this->validateExam($request);

        // Remove grade_ids from validated data as it is not in exams table
        $examData = collect($validated)->except(['grade_ids'])->toArray();

        $exam->update($examData);

        $exam->grades()->sync($request->input('grade_ids', []));

        return redirect()->back()->with('success', 'Exam updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exam $exam)
    {
        $exam->delete();
        return redirect()->back()->with('success', 'Exam deleted successfully.');
    }

    public function regenerateToken(Exam $exam)
    {
        $exam->update([
            'token' => Exam::generateToken(),
        ]);

        return redirect()->back()->with('success', 'Token regenerated successfully.');
    }

    public function toggleTokenVisibility(Exam $exam)
    {
        $exam->update([
            'is_token_visible' => !$exam->is_token_visible,
        ]);

        return redirect()->back()->with('success', 'Token visibility toggled successfully.');
    }

    public function monitor(Exam $exam)
    {
        // Fetch specific fields to optimize performance
        $exam->load('grades', 'subject', 'academicYear');

        // Get all sessions for this exam with student info, ordered by latest
        $allSessions = \App\Models\ExamSession::with([
            'user' => function ($query) use ($exam) {
                $query->select('id', 'name', 'email')
                    ->with(['examResults' => function ($q) use ($exam) {
                        $q->where('exam_id', $exam->id);
                    }]);
            },
            'exam'
        ])
            ->where('exam_id', $exam->id)
            ->latest()
            ->get();

        // Unique sessions by user_id to show only one entry per student (the latest one)
        $sessions = $allSessions->unique('user_id')->values();

        // Total students expected from the grades (Sum of students in all linked grades)
        $totalStudents = 0;
        foreach ($exam->grades as $grade) {
            $totalStudents += $grade->students()
                ->where('user_type', 'student')
                ->count();
        }

        return Inertia::render('admin/exams/monitor', [
            'exam' => $exam,
            'sessions' => $sessions,
            'total_students' => $totalStudents,
            'participated_count' => $sessions->count(),
        ]);
    }

    public function correction(\App\Models\ExamSession $session)
    {
        $session->load(['user', 'exam.subject', 'examResultDetails.examQuestion.originalQuestion.tags', 'examResult']);

        // Fetch all attempts for this user and exam
        $allSessions = \App\Models\ExamSession::with(['examResultDetails.examQuestion', 'examResult'])
            ->where('exam_id', $session->exam_id)
            ->where('user_id', $session->user_id)
            ->orderBy('attempt_number', 'asc')
            ->get();

        // Prepare Analysis Data
        $analysisResult = $this->analysisService->calculateMasteryAnalysis($session, $session->exam);
        $normReference = $this->analysisService->calculateNormReference($session->exam, $session);
        $leaderboard = $this->analysisService->getLeaderboard($session->exam, $session->user_id); // Highlight this user
        $questions = $this->analysisService->getFormattedQuestions($session);

        $totalScore = $session->final_score;

        return Inertia::render('admin/exams/correction', [
            'session' => $session,
            'all_sessions' => $allSessions,
            'analysis' => $analysisResult,
            'norm_reference' => $normReference,
            'leaderboard' => $leaderboard,
            'questions' => $questions,
            'total_score' => $totalScore,
        ]);
    }

    private function validateExam(Request $request)
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'academic_year_id' => 'required|exists:academic_years,id',
            'grade_ids' => 'required|array',
            'grade_ids.*' => 'exists:grades,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:users,id',
            'question_bank_id' => 'required|exists:question_banks,id',
            'exam_type' => ['required', Rule::in(ExamTypeEnum::cases())],
            'duration' => 'required|integer|min:1',
            'passing_score' => 'required|integer|min:0|max:100',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'is_published' => 'required|boolean',
            'is_randomized' => 'required|boolean',
            'is_answer_randomized' => 'nullable|boolean',
            'show_result_on_finish' => 'nullable|boolean',
            'is_hint_visible' => 'nullable|boolean',
            'max_attempts' => 'nullable|integer|min:1',
            'timer_type' => ['nullable', Rule::in(array_map(fn($case) => $case->value, TimerTypeEnum::cases()))],
        ]);
    }

    public function calculateScores(Request $request, \App\Models\ExamSession $session)
    {
        $validated = $request->validate([
            'question_type' => ['required'], // Can be string 'all' or array
        ]);

        $questionTypes = $request->input('question_type', 'all');

        // Extra validation/sanitization to ensure it's 'all' or an array of strings
        if ($questionTypes !== 'all' && !is_array($questionTypes)) {
            // Fallback or error if strictly needed, but let's assume 'all' if valid structure missing
            $questionTypes = 'all';
        }

        $typeLog = is_array($questionTypes) ? json_encode($questionTypes) : $questionTypes;

        \Illuminate\Support\Facades\Log::info("Recalculate requested for Session: {$session->id}, User: {$session->user_id}, Exam: {$session->exam_id}, Types: {$typeLog}");

        // Get all sessions for this user and exam to ensure everything is consistent
        $sessions = \App\Models\ExamSession::where('exam_id', $session->exam_id)
            ->where('user_id', $session->user_id)
            ->get();

        \Illuminate\Support\Facades\Log::info("Found " . $sessions->count() . " sessions for recalculation.");

        foreach ($sessions as $s) {
            \Illuminate\Support\Facades\Log::info("Dispatching CalculateExamScore for session {$s->id}");
            \App\Jobs\CalculateExamScore::dispatch($s, $questionTypes);
        }

        return redirect()->back()->with('success', 'Scores recalculated successfully for all attempts.');
    }

    public function calculateAllScores(Request $request, \App\Models\Exam $exam)
    {
        $validated = $request->validate([
            'question_type' => ['required'],
        ]);

        $questionTypes = $request->input('question_type', 'all');

        if ($questionTypes !== 'all' && !is_array($questionTypes)) {
            $questionTypes = 'all';
        }

        $typeLog = is_array($questionTypes) ? json_encode($questionTypes) : $questionTypes;

        \Illuminate\Support\Facades\Log::info("Global Recalculate requested for Exam: {$exam->id}, Types: {$typeLog}");

        // Fetch ALL sessions for this exam
        // We might want to chunk this if there are thousands, but for now simple get() is fine.
        $sessions = $exam->examSessions;

        $count = $sessions->count();
        \Illuminate\Support\Facades\Log::info("Found {$count} total sessions for exam {$exam->id}. Dispatching jobs...");

        foreach ($sessions as $s) {
            \App\Jobs\CalculateExamScore::dispatch($s, $questionTypes);
        }

        return redirect()->back()->with('success', "Score recalculation queued for all {$count} sessions.");
    }
}
