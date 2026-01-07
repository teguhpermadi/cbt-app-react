<?php

namespace Database\Factories;

use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'code' => $this->faker->word(),
            'description' => $this->faker->paragraph(),
            'academic_year_id' => AcademicYear::get()->random()->id,
            'grade_id' => Grade::get()->random()->id,
            'user_id' => User::where('user_type', 'teacher')->inRandomOrder()->first()->id,
        ];
    }
}
