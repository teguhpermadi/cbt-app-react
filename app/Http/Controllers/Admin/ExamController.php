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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $exams = Exam::with(['academicYear', 'grade', 'subject', 'teacher'])
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

        $data = $request->all();
        $data['token'] = Exam::generateToken();
        Exam::create($data);

        return redirect()->back()->with('success', 'Exam created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Exam $exam)
    {
        $exam->load(['academicYear', 'grade', 'subject', 'teacher', 'questionBank']);

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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'exam_type' => ['required', Rule::in(ExamTypeEnum::cases())],
            'duration' => 'required|integer|min:1',
            'passing_score' => 'required|integer|min:0|max:100',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'is_published' => 'required|boolean',
            'is_randomized' => 'required|boolean',
            'is_answer_randomized' => 'nullable|boolean',
            'max_attempts' => 'nullable|integer|min:1',
            'timer_type' => ['nullable', Rule::in(array_map(fn($case) => $case->value, TimerTypeEnum::cases()))],
        ]);

        $exam->update($validated);

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
        $exam->load('grade', 'subject', 'academicYear');

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

        // Total students expected from the grade
        $totalStudents = $exam->grade->students()
            ->where('user_type', 'student')
            ->count();

        return Inertia::render('admin/exams/monitor', [
            'exam' => $exam,
            'sessions' => $sessions,
            'total_students' => $totalStudents,
            'participated_count' => $sessions->count(),
        ]);
    }

    public function correction(\App\Models\ExamSession $session)
    {
        $session->load(['user', 'exam.subject', 'examResultDetails.examQuestion', 'examResult']);

        // Fetch all attempts for this user and exam
        $allSessions = \App\Models\ExamSession::with(['examResultDetails.examQuestion', 'examResult'])
            ->where('exam_id', $session->exam_id)
            ->where('user_id', $session->user_id)
            ->orderBy('attempt_number', 'asc')
            ->get();

        return Inertia::render('admin/exams/correction', [
            'session' => $session,
            'all_sessions' => $allSessions,
        ]);
    }

    private function validateExam(Request $request)
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'academic_year_id' => 'required|exists:academic_years,id',
            'grade_id' => 'required|exists:grades,id',
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
            'max_attempts' => 'nullable|integer|min:1',
            'timer_type' => ['nullable', Rule::in(array_map(fn($case) => $case->value, TimerTypeEnum::cases()))],
        ]);
    }

    public function calculateScores(\App\Models\ExamSession $session)
    {
        \Illuminate\Support\Facades\Log::info("Recalculate requested for Session: {$session->id}, User: {$session->user_id}, Exam: {$session->exam_id}");

        // Get all sessions for this user and exam to ensure everything is consistent
        $sessions = \App\Models\ExamSession::where('exam_id', $session->exam_id)
            ->where('user_id', $session->user_id)
            ->get();

        \Illuminate\Support\Facades\Log::info("Found " . $sessions->count() . " sessions for recalculation.");

        foreach ($sessions as $s) {
            \Illuminate\Support\Facades\Log::info("Dispatching CalculateExamScore for session {$s->id}");
            \App\Jobs\CalculateExamScore::dispatch($s);
        }

        return redirect()->back()->with('success', 'Scores recalculated successfully for all attempts.');
    }
}
