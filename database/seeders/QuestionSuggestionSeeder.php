<?php

namespace Database\Seeders;

use App\Models\QuestionSuggestion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionSuggestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        QuestionSuggestion::factory()->count(10)->create();
    }
}
