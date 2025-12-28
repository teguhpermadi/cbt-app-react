<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Grade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $grades = Grade::with('academicYear')
            ->withCount('students')
            ->latest()
            ->paginate(10);

        $academicYears = AcademicYear::active()->get();

        return Inertia::render('admin/grades/index', [
            'grades' => $grades,
            'academicYears' => $academicYears,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'nullable|string|max:255',
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);

        Grade::create($validated);

        return redirect()->back()->with('success', 'Grade created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Grade $grade)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'nullable|string|max:255',
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);

        $grade->update($validated);

        return redirect()->back()->with('success', 'Grade updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Grade $grade)
    {
        $grade->delete();

        return redirect()->back()->with('success', 'Grade deleted successfully.');
    }
}
