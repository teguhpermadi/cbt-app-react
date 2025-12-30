<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\AcademicYear;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(): Response
    {
        $students = User::with(['roles', 'grades'])
            ->where('user_type', 'student')
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/students/index', [
            'students' => $students,
            'grades' => Grade::all(),
            'academicYears' => AcademicYear::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'grade_id' => 'required|exists:grades,id',
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);

        $student = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'user_type' => 'student',
        ]);

        // Assign 'student' role
        $student->assignRole('student');

        // Link to grade and academic year
        $student->grades()->attach($validated['grade_id'], [
            'id' => \Illuminate\Support\Str::ulid(),
            'academic_year_id' => $validated['academic_year_id'],
            'is_active' => true,
        ]);

        return back()->with('success', 'Student created successfully.');
    }

    public function update(Request $request, User $student)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($student->id)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($student->id)],
            'grade_id' => 'required|exists:grades,id',
        ]);

        $student->update($validated);

        // Update grade if changed (simplified logic)
        $student->grades()->sync([$validated['grade_id'] => [
            'id' => \Illuminate\Support\Str::ulid(),
            'academic_year_id' => AcademicYear::active()->first()?->id,
            'is_active' => true,
        ]]);

        return back()->with('success', 'Student updated successfully.');
    }

    public function destroy(User $student)
    {
        $student->delete();
        return back()->with('success', 'Student deleted successfully.');
    }
}
