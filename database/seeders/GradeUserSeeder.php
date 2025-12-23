<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GradeUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = \App\Models\User::where('user_type', 'student')->get();
        $grades = \App\Models\Grade::all();

        if ($grades->isEmpty()) {
            $this->command->warn('No grades found. Skipping GradeUser seeding.');
            return;
        }

        $activeYear = \App\Models\AcademicYear::active()->first();

        foreach ($students as $student) {
            // Assign each student to a random grade
            $student->grades()->attach(
                $grades->random()->id,
                [
                    'is_active' => true,
                    'id' => (string) \Illuminate\Support\Str::ulid(),
                    'academic_year_id' => $activeYear?->id
                ]
            );
        }
    }
}
