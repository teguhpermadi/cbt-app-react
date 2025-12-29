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

        // Get all sessions for this exam with student info
        $sessions = \App\Models\ExamSession::with(['user:id,name,email', 'exam'])
            ->where('exam_id', $exam->id)
            ->latest()
            ->get();

        // Total students expected from the grade
        $totalStudents = $exam->grade->students()
            ->where('user_type', 'student')
            ->count();

        return Inertia::render('admin/exams/monitor', [
            'exam' => $exam,
            'sessions' => $sessions,
            'total_students' => $totalStudents,
            'participated_count' => $sessions->unique('user_id')->count(),
        ]);
    }

    public function correction(\App\Models\ExamSession $session)
    {
        $session->load(['user', 'exam.subject', 'examResultDetails.examQuestion', 'examResult']);

        return Inertia::render('admin/exams/correction', [
            'session' => $session,
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
}
