<?php

namespace Database\Seeders;

use App\Models\QuestionPeerReview;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionPeerReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        QuestionPeerReview::factory(10)->create();
    }
}
