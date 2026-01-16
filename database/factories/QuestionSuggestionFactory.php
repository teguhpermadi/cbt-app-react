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
        return [
            'question_id' => Question::factory(),
            'user_id' => User::factory(),
            'data' => [
                'content' => $this->faker->paragraph,
                'score_value' => $this->faker->numberBetween(1, 10),
            ],
            'description' => $this->faker->sentence,
            'state' => Pending::class,
        ];
    }
}
