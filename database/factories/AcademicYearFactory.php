<?php

namespace Database\Factories;

use App\Models\AcademicYear;
use App\Enums\SemesterEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AcademicYear>
 */
class AcademicYearFactory extends Factory
{
    protected $model = AcademicYear::class;

    public function definition(): array
    {
        $startYear = $this->faker->numberBetween(2020, 2030);
        $endYear = $startYear + 1;
        $semester = $this->faker->randomElement(SemesterEnum::cases());
        
        return [
            'year' => "{$startYear}/{$endYear}",
            'semester' => $semester,
            'is_active' => false,
        ];
    }
    
    // State untuk tahun ajaran aktif
    public function active(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }
}
