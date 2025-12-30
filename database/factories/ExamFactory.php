<?php

namespace Database\Factories;

use App\Enums\ExamTypeEnum;
use App\Enums\TimerTypeEnum;
use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Exam>
 */
class ExamFactory extends Factory
{
    public function definition(): array
    {
        // 1. Coba ambil Question Bank acak
        $questionBank = \App\Models\QuestionBank::inRandomOrder()->first();

        if ($questionBank) {
            // Jika ada Bank Soal, gunakan Subject dan Grade dari Bank Soal tersebut (via Subject)
            $subject = $questionBank->subject;
            $grade = $subject->grade; // Subject punya relasi ke Grade
            $academicYear = $subject->academicYear; // Subject punya relasi ke AcademicYear
        } else {
            // Fallback: Jika tidak ada Question Bank, ambil random
            $subject = Subject::inRandomOrder()->first() ?? Subject::factory()->create();
            $grade = $subject->grade ?? Grade::inRandomOrder()->first() ?? Grade::factory()->create();
            $academicYear = $subject->academicYear ?? AcademicYear::inRandomOrder()->first() ?? AcademicYear::factory()->create();
        }

        // Asumsi guru yang membuat ujian adalah user_type 'teacher'
        $teacher = User::where('user_type', 'teacher')->inRandomOrder()->first() ?? User::factory()->create(['user_type' => 'teacher']);

        $examType = $this->faker->randomElement(ExamTypeEnum::cases());
        $titlePrefix = match ($examType) {
            ExamTypeEnum::Daily => 'Ulangan Harian',
            ExamTypeEnum::Midterm => 'Ujian Tengah Semester',
            ExamTypeEnum::Final => 'Ujian Akhir Semester',
            ExamTypeEnum::Tryout => 'Try Out Mandiri',
        };

        // Waktu mulai dan berakhir ujian
        $startTime = $this->faker->dateTimeBetween('-1 week', '+1 week');
        $endTime = (clone $startTime)->modify('+1 hour'); // Durasi 1 jam default

        // show result page
        $showResultPage = $this->faker->boolean(50);

        return [
            'academic_year_id' => $academicYear->id,
            'grade_id' => $grade->id,
            'subject_id' => $subject->id,
            'teacher_id' => $teacher->id,
            'question_bank_id' => $questionBank?->id,

            'title' => "{$titlePrefix} {$subject->name} Kelas {$grade->name}",
            'exam_type' => $examType,

            'token' => \App\Models\Exam::generateToken(),
            'is_token_visible' => $this->faker->boolean(80), // 80% token ditampilkan

            'duration' => $this->faker->randomElement([60, 90, 120]), // Durasi 60/90/120 menit

            'passing_score' => $this->faker->randomElement([65, 70, 75]),

            'is_published' => $this->faker->boolean(70), // 70% sudah terbit
            'is_randomized' => $this->faker->boolean(80), // 80% urutan diacak
            'is_answer_randomized' => $this->faker->boolean(60), // 60% jawaban diacak
            'max_attempts' => $this->faker->randomElement([null, 1, 2, 3]), // null = unlimited
            'timer_type' => $this->faker->randomElement(TimerTypeEnum::cases()),

            'start_time' => $startTime,
            'end_time' => $endTime,

            'show_result_on_finish' => $showResultPage,
        ];
    }
}
