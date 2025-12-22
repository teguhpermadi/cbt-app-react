<?php

namespace Database\Seeders;

use App\Enums\ExamTypeEnum;
use App\Models\Exam;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Database\Seeder;

class ExamSessionSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil SEMUA Exam dan Student yang sudah di-seed
        $exams = Exam::all();
        $students = User::where('user_type', 'student')->limit(15)->get(); // Tetap ambil 15

        if ($exams->isEmpty() || $students->isEmpty()) {
            $this->command->warn('❌ Exam atau Student tidak cukup.');
            return;
        }

        $this->command->info('Membuat sesi ujian (ExamSession) dummy...');

        foreach ($exams as $exam) {
            $studentsToCreate = $students->shuffle()->take(rand(5, 10));

            foreach ($studentsToCreate as $student) {
                // Percobaan 1 (Wajib)
                ExamSession::factory()->create([
                    'exam_id' => $exam->id, // Tautkan ID Exam spesifik dari loop
                    'user_id' => $student->id, // Tautkan ID Student spesifik dari loop
                    'attempt_number' => 1,
                ]);

                // Tambahkan percobaan kedua/ketiga jika tipenya adalah Tryout
                if ($exam->exam_type->value === ExamTypeEnum::Tryout->value && rand(0, 1) === 1) {
                    ExamSession::factory()->create([
                        'exam_id' => $exam->id,
                        'user_id' => $student->id,
                        'attempt_number' => 2,
                        'total_score' => rand(70, 95),
                    ]);
                }
            }
            $this->command->getOutput()->write("  -> Exam {$exam->title} memiliki sesi pengerjaan.\n");
        }

        $this->command->info('✅ ExamSession Seeder selesai.');
    }
}