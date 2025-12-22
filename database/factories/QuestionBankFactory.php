<?php

namespace Database\Factories;

use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuestionBank>
 */
class QuestionBankFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // ambil random subject
        $subject = Subject::inRandomOrder()->first();

        return [
            'subject_id' => $subject->id,
            'user_id' => $subject->user_id,
            'name' => 'Bank Soal ' . $this->faker->words(2, true) . ' - Level ' . $this->faker->numberBetween(1, 3),
            'description' => $this->faker->paragraph(),
            'is_public' => $this->faker->boolean(20), // 20% kemungkinan public
        ];
    }
}
