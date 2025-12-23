<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ExamTypeEnum;
use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Exam;
use App\Models\Grade;
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

        return Inertia::render('admin/exams/index', [
            'exams' => $exams,
            'academicYears' => $academicYears,
            'grades' => $grades,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'examTypes' => ExamTypeEnum::cases(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->validateExam($request);

        Exam::create($request->all());

        return redirect()->back()->with('success', 'Exam created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Exam $exam)
    {
        $this->validateExam($request);

        $exam->update($request->all());

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

    private function validateExam(Request $request)
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'academic_year_id' => 'required|exists:academic_years,id',
            'grade_id' => 'required|exists:grades,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:users,id',
            'exam_type' => ['required', Rule::in(ExamTypeEnum::cases())],
            'duration' => 'required|integer|min:1',
            'passing_score' => 'required|integer|min:0|max:100',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'is_published' => 'required|boolean',
            'is_randomized' => 'required|boolean',
        ]);
    }
}