<?php

namespace Database\Factories;

use App\Models\Option;
use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Option>
 */
class OptionFactory extends Factory
{
    protected $model = Option::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'question_id' => Question::factory(),
            'option_key' => $this->faker->randomElement(['A', 'B', 'C', 'D']),
            'content' => $this->faker->sentence(),
            'media_path' => null,
            'order' => $this->faker->numberBetween(0, 10),
            'is_correct' => false,
            'metadata' => null,
        ];
    }

    /**
     * Mark option as correct answer
     */
    public function correct(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_correct' => true,
        ]);
    }

    /**
     * Set option for multiple choice
     */
    public function forMultipleChoice(string $key, bool $isCorrect = false): static
    {
        return $this->state(fn(array $attributes) => [
            'option_key' => $key,
            'content' => $this->faker->sentence(3),
            'is_correct' => $isCorrect,
            'order' => ord($key) - ord('A'), // A=0, B=1, C=2, D=3
        ]);
    }

    /**
     * Set option for true/false
     */
    public function forTrueFalse(bool $isTrue, bool $isCorrect = false): static
    {
        return $this->state(fn(array $attributes) => [
            'option_key' => $isTrue ? 'T' : 'F',
            'content' => $isTrue ? 'Benar' : 'Salah',
            'is_correct' => $isCorrect,
            'order' => $isTrue ? 0 : 1,
        ]);
    }

    /**
     * Set option for matching (left side)
     */
    public function forMatchingLeft(int $pairId, string $content): static
    {
        return $this->state(fn(array $attributes) => [
            'option_key' => 'L' . $pairId,
            'content' => $content,
            'order' => ($pairId - 1) * 2,
            'metadata' => [
                'side' => 'left',
                'pair_id' => $pairId,
                'match_with' => 'R' . $pairId,
            ],
        ]);
    }

    /**
     * Set option for matching (right side)
     */
    public function forMatchingRight(int $pairId, string $content): static
    {
        return $this->state(fn(array $attributes) => [
            'option_key' => 'R' . $pairId,
            'content' => $content,
            'order' => ($pairId - 1) * 2 + 1,
            'metadata' => [
                'side' => 'right',
                'pair_id' => $pairId,
                'match_with' => 'L' . $pairId,
            ],
        ]);
    }

    /**
     * Set option for ordering
     */
    public function forOrdering(int $position, string $content): static
    {
        return $this->state(fn(array $attributes) => [
            'option_key' => (string)$position,
            'content' => $content,
            'order' => $position - 1,
            'metadata' => [
                'correct_position' => $position,
            ],
        ]);
    }

    /**
     * Set option for numerical input
     */
    public function forNumericalInput(float $answer, float $tolerance = 0, ?string $unit = null): static
    {
        return $this->state(fn(array $attributes) => [
            'option_key' => 'NUM',
            'content' => (string)$answer,
            'is_correct' => true,
            'order' => 0,
            'metadata' => [
                'tolerance' => $tolerance,
                'unit' => $unit,
                'correct_answer' => $answer,
            ],
        ]);
    }

    /**
     * Attach media to option
     */
    public function withMedia(string $mediaPath): static
    {
        return $this->state(fn(array $attributes) => [
            'media_path' => $mediaPath,
        ]);
    }

    /**
     * Set custom metadata
     */
    public function withMetadata(array $metadata): static
    {
        return $this->state(fn(array $attributes) => [
            'metadata' => array_merge($attributes['metadata'] ?? [], $metadata),
        ]);
    }
}
