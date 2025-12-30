<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class GradeStudentController extends Controller
{
    /**
     * Get students for a specific grade.
     */
    public function index(Grade $grade)
    {
        $activeAcademicYear = AcademicYear::active()->first();

        $students = $grade->students;

        $availableQuery = User::where('user_type', 'student');

        if ($activeAcademicYear) {
            $availableQuery->whereDoesntHave('grades', function ($query) use ($activeAcademicYear) {
                // Fix ambiguous column by specifying table name (pivot table)
                $query->where('grade_user.academic_year_id', $activeAcademicYear->id);
            });
        }

        $availableStudents = $availableQuery->get();

        return response()->json([
            'students' => $students,
            'available_students' => $availableStudents, // Caution: heavy if many students. Consider select/limit.
        ]);
    }

    /**
     * Assign a student to a grade.
     */
    public function store(Request $request, Grade $grade)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::findOrFail($request->user_id);

        // 1. Check if user is a student
        if ($user->user_type !== 'student') {
            throw ValidationException::withMessages([
                'user_id' => ['User must be a student.'],
            ]);
        }

        // 2. Get active academic year
        $activeAcademicYear = AcademicYear::active()->first();

        if (!$activeAcademicYear) {
            throw ValidationException::withMessages([
                'academic_year_id' => ['No active academic year found.'],
            ]);
        }

        // 3. Check if the grade belongs to the active academic year
        if ($grade->academic_year_id !== $activeAcademicYear->id) {
            throw ValidationException::withMessages([
                'grade_id' => ['Cannot assign students to a grade from an inactive academic year.'],
            ]);
        }

        // 4. Check if student already has a grade in this active academic year
        // We query the pivot table or the user's grades filtered by the active academic year
        $existingGrade = $user->grades()
            ->where('grade_user.academic_year_id', $activeAcademicYear->id)
            ->exists();

        if ($existingGrade) {
            throw ValidationException::withMessages([
                'user_id' => ['Student is already assigned to a grade in this active academic year.'],
            ]);
        }

        // Assign
        $grade->students()->attach($user->id, [
            'academic_year_id' => $activeAcademicYear->id,
            'is_active' => true,
        ]);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Student assigned to grade successfully.']);
        }

        return redirect()->back()->with('success', 'Student assigned to grade successfully.');
    }

    /**
     * Remove a student from a grade.
     */
    public function destroy(Grade $grade, User $student)
    {
        $grade->students()->detach($student->id);

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Student removed from grade successfully.']);
        }

        return redirect()->back()->with('success', 'Student removed from grade successfully.');
    }
}
