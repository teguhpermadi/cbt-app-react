<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GradeUser>
 */
class GradeUserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'grade_id' => \App\Models\Grade::factory(),
            'user_id' => \App\Models\User::factory(),
            'academic_year_id' => \App\Models\AcademicYear::active()->first()?->id ?? \App\Models\AcademicYear::factory(),
            'is_active' => true,
        ];
    }
}
