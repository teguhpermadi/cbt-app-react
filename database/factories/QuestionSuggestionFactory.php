<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\QuestionSuggestion;
use App\Models\User;
use App\States\QuestionSuggestion\Pending;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuestionSuggestion>
 */
class QuestionSuggestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $questions = Question::get()->random();
        $teacher = User::where('user_type', 'teacher')->get()->random();
        return [
            'question_id' => $questions->id,
            'user_id' => $teacher->id,
            'data' => [
                'content' => $this->faker->paragraph,
                'score_value' => $this->faker->numberBetween(1, 5),
            ],
            'description' => $this->faker->sentence,
            'state' => Pending::class,
        ];
    }
}
