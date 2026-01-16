<?php

namespace Database\Factories;

use App\Models\ReadingMaterial;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReadingMaterial>
 */
class ReadingMaterialFactory extends Factory
{
    protected $model = ReadingMaterial::class;

    public function definition(): array
    {
        return [
            // Pastikan ada Subject yang sudah dibuat, atau gunakan callback
            'subject_id' => Subject::inRandomOrder()->first()?->id ?? Subject::factory()->create()->id,
            'title' => 'Materi: ' . $this->faker->words(3, true),
            'content' => $this->faker->paragraphs(5, true),
        ];
    }
}
