<?php

namespace Database\Factories;

use App\Enums\ReviewStatusEnum; // Import Enum
use App\Models\Question;
use App\Models\QuestionPeerReview;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionPeerReviewFactory extends Factory
{
    protected $model = QuestionPeerReview::class;

    public function definition(): array
    {
        $reviewer = User::where('user_type', 'teacher')->inRandomOrder()->first() ?? User::factory()->create(['user_type' => 'teacher']);
        
        $question = Question::get()->random();

        // Mengambil salah satu case dari Enum secara acak
        $status = $this->faker->randomElement(ReviewStatusEnum::cases());

        return [
            'question_id' => $question->id,
            'reviewer_id' => $reviewer->id,
            'status' => $status, // Langsung menggunakan objek Enum
            'notes' => match ($status) {
                ReviewStatusEnum::Approved => 'Soal sudah sesuai dan sangat baik. Siap digunakan.',
                ReviewStatusEnum::Rejected => 'Konten soal ambigu dan kunci jawaban salah. Mohon revisi total.',
                ReviewStatusEnum::Revision => 'Ada kesalahan ketik di opsi C dan format gambar kurang jelas. Perlu perbaikan.',
                ReviewStatusEnum::Pending => 'Belum ada catatan detail, masih menunggu review dari tim.',
            },
            // Hanya mengisi reviewed_at jika status bukan 'pending'
            'reviewed_at' => ($status !== ReviewStatusEnum::Pending) ? now() : null, 
        ];
    }
}