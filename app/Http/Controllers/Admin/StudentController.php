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
use App\Exports\StudentTemplateExport;
use Maatwebsite\Excel\Facades\Excel;

class StudentController extends Controller
{
    public function downloadTemplate()
    {
        return Excel::download(new StudentTemplateExport, 'students_import_template.xlsx');
    }

    public function export()
    {
        return Excel::download(new \App\Exports\StudentsExport, 'students.xlsx');
    }

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

        // Create StudentData with plain password
        $student->studentData()->create([
            'plain_password' => $validated['password'],
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

    public function storeImport(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls|max:2048',
        ]);

        try {
            $file = $request->file('file');

            // Read Excel file
            $data = Excel::toArray([], $file);

            if (empty($data) || empty($data[0])) {
                return back()->withErrors(['file' => 'The Excel file is empty.']);
            }

            $rows = $data[0];
            $headers = array_shift($rows); // Remove header row

            // Normalize headers to lowercase
            $headers = array_map(fn($h) => strtolower(trim($h)), $headers);

            $studentsData = [];
            $errors = [];

            foreach ($rows as $index => $row) {
                if (empty(array_filter($row))) continue; // Skip empty rows

                $rowData = array_combine($headers, $row);

                $studentData = [
                    'name' => $rowData['name'] ?? $rowData['nama'] ?? null,
                    'username' => $rowData['username'] ?? null,
                    'email' => $rowData['email'] ?? null,
                ];

                $studentDataMap = [
                    'nisn' => $rowData['nisn'] ?? null,
                    'nis' => $rowData['nis'] ?? null,
                    'nomor_ujian' => $rowData['nomor_ujian'] ?? null,
                    'jenis_kelamin' => $rowData['jenis_kelamin_lp'] ?? null,
                    'tempat_lahir' => $rowData['tempat_lahir'] ?? null,
                    'tanggal_lahir' => $rowData['tanggal_lahir_yyyy_mm_dd'] ?? null,
                    'password' => $rowData['password'] ?? 'password123',
                ];

                $studentsData[] = array_merge($studentData, ['student_details' => $studentDataMap]);
            }

            // ... (validation remains same) ...

            if (empty($studentsData)) {
                return back()->withErrors(['file' => 'No valid student data found in the file.']);
            }

            // Import students in transaction
            \Illuminate\Support\Facades\DB::transaction(function () use ($studentsData) {
                foreach ($studentsData as $data) {
                    // Check for duplicates
                    if (User::where('email', $data['email'])->exists()) continue;
                    if (User::where('username', $data['username'])->exists()) continue;

                    // Create User
                    $student = User::create([
                        'name' => $data['name'],
                        'username' => $data['username'],
                        'email' => $data['email'],
                        'password' => Hash::make($data['student_details']['password']), // Use mapped password
                        'user_type' => 'student',
                    ]);

                    // Assign Role
                    $student->assignRole('student');

                    // Create StudentData
                    $student->studentData()->create([
                        'plain_password' => $data['student_details']['password'],
                        'nisn' => $data['student_details']['nisn'],
                        'nis' => $data['student_details']['nis'],
                        'nomor_ujian' => $data['student_details']['nomor_ujian'],
                        'jenis_kelamin' => $data['student_details']['jenis_kelamin'],
                        'tempat_lahir' => $data['student_details']['tempat_lahir'],
                        'tanggal_lahir' => $data['student_details']['tanggal_lahir'],
                    ]);
                }
            });

            return back()->with('success', count($studentsData) . ' students imported successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['file' => 'Error importing file: ' . $e->getMessage()]);
        }
    }
}
