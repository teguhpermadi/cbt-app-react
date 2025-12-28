<?php

namespace Database\Seeders;

use App\Models\ExamResultDetail;
use App\Models\ExamSession;
use App\Models\ExamQuestion;
use Illuminate\Database\Seeder;

class ExamResultDetailSeeder extends Seeder
{
    public function run(): void
    {
        $sessions = ExamSession::all();

        if ($sessions->isEmpty()) {
            $this->command->warn('❌ Tidak ada ExamSession. Harap jalankan ExamSession Seeder terlebih dahulu.');
            return;
        }

        $this->command->info('Membuat detail jawaban (ExamResultDetail) untuk setiap sesi...');

        $successfulDetails = 0;
        $skippedSessions = 0;
        $faker = \Faker\Factory::create('id_ID');

        foreach ($sessions as $session) {
            // Ambil ExamQuestion secara langsung berdasarkan ID, bukan melalui relasi
            $questions = ExamQuestion::where('exam_id', $session->exam_id)->get();

            $totalDetails = 0;

            if ($questions->isEmpty()) {
                $skippedSessions++;
                continue;
            }

            foreach ($questions as $question) {
                // Tentukan data berdasarkan tipe soal
                $questionType = $question->question_type;
                $keyAnswer = $question->key_answer;
                $options = $question->options ?? [];

                // Probabilitas benar simulasi (70% benar)
                $isCorrect = $faker->boolean(70);

                $studentAnswer = null;
                $scoreEarned = 0;

                switch ($questionType) {
                    case \App\Enums\QuestionTypeEnum::MultipleChoice:
                        // Logika Multiple Choice
                        $correctKey = $keyAnswer['answer'] ?? null;
                        if ($isCorrect && $correctKey) {
                            $studentAnswer = ['answer' => $correctKey];
                        } else {
                            // Ambil option random yang bukan kunci jawaban
                            $wrongOptions = array_filter(array_keys($options), fn($k) => $k !== $correctKey);
                            $selectedKey = !empty($wrongOptions) ? $faker->randomElement($wrongOptions) : $correctKey;
                            $studentAnswer = ['answer' => $selectedKey];
                        }
                        break;

                    case \App\Enums\QuestionTypeEnum::TrueFalse:
                        // Logika True False
                        $correctKey = $keyAnswer['answer'] ?? null;
                        if ($isCorrect && $correctKey) {
                            $studentAnswer = ['answer' => $correctKey];
                        } else {
                            $wrongOptions = array_filter(array_keys($options), fn($k) => $k !== $correctKey);
                            $selectedKey = !empty($wrongOptions) ? $faker->randomElement($wrongOptions) : $correctKey;
                            $studentAnswer = ['answer' => $selectedKey];
                        }
                        break;

                    case \App\Enums\QuestionTypeEnum::MultipleSelection:
                        // Logika Multiple Selection
                        $correctKeys = $keyAnswer['answers'] ?? [];
                        if ($isCorrect) {
                            $studentAnswer = ['answers' => $correctKeys];
                        } else {
                            // Campur aduk
                            $allKeys = array_keys($options);
                            // Ambil sebagian benar, sebagian salah
                            $selected = $faker->randomElements($allKeys, rand(1, count($allKeys)));
                            $studentAnswer = ['answers' => $selected];

                            // Re-check correctness manual jika random ternyata benar semua
                            // (Simplifikasi: di sini kita biarkan, nanti dihitung skor)
                            // Tapi agar $isCorrect konsisten:
                            $diff = array_diff($correctKeys, $selected);
                            $diff2 = array_diff($selected, $correctKeys);
                            if (empty($diff) && empty($diff2)) {
                                $isCorrect = true;
                            } else {
                                $isCorrect = false;
                            }
                        }
                        break;

                    case \App\Enums\QuestionTypeEnum::Matching:
                        // Logika Matching
                        $correctPairs = $keyAnswer['pairs'] ?? [];
                        if ($isCorrect) {
                            $studentAnswer = ['pairs' => $correctPairs];
                        } else {
                            // Acak pasangannya
                            $leftSides = array_keys($correctPairs);
                            $rightSides = array_values($correctPairs);
                            shuffle($rightSides);
                            if (!empty($leftSides) && !empty($rightSides)) {
                                $studentAnswer = ['pairs' => array_combine($leftSides, $rightSides)];
                            } else {
                                $studentAnswer = ['pairs' => []];
                            }
                            $isCorrect = false;
                        }
                        break;

                    case \App\Enums\QuestionTypeEnum::Ordering:
                        // Logika Ordering
                        $correctOrder = $keyAnswer['order'] ?? [];
                        if ($isCorrect) {
                            $studentAnswer = ['order' => $correctOrder];
                        } else {
                            $shuffled = $correctOrder;
                            shuffle($shuffled);
                            // Pastikan tidak sama (kecuali elemen cuma 0 atau 1)
                            if (count($shuffled) > 1 && $shuffled === $correctOrder) {
                                // Swap 2 elemen pertama
                                $temp = $shuffled[0];
                                $shuffled[0] = $shuffled[1];
                                $shuffled[1] = $temp;
                            }
                            $studentAnswer = ['order' => $shuffled];
                            $isCorrect = false;
                        }
                        break;

                    case \App\Enums\QuestionTypeEnum::NumericalInput:
                        $correctVal = $keyAnswer['answer'] ?? 0;
                        if ($isCorrect) {
                            $studentAnswer = ['answer' => $correctVal];
                        } else {
                            $wrongVal = (float)$correctVal + $faker->randomFloat(1, 1, 5); // Salah dikit
                            $studentAnswer = ['answer' => $wrongVal];
                            $isCorrect = false;
                        }
                        break;

                    case \App\Enums\QuestionTypeEnum::Essay:
                        $studentAnswer = ['text' => $faker->paragraph()];
                        $isCorrect = null; // Essay butuh koreksi manual biasanya, atau null
                        $scoreEarned = 0; // Nanti dinilai guru
                        break;
                }

                // Kalkulasi Score (Sederhana)
                if ($questionType !== \App\Enums\QuestionTypeEnum::Essay) {
                    // Jika Essay, score 0 dulu atau random jika mau simulasi sudah dinilai
                    if ($isCorrect) {
                        $scoreEarned = $question->score_value;
                    } else {
                        $scoreEarned = 0;
                    }
                } else {
                    // Simulasi Essay sudah dinilai 50% chance
                    if ($faker->boolean(50)) {
                        $scoreEarned = rand(0, $question->score_value);
                        $isCorrect = $scoreEarned > ($question->score_value / 2); // Anggap benar jika > 50% nilai
                    }
                }

                // Prevent duplication if run multiple times
                // Or just create new ones. Since it's a seeder, usually we truncate or just add.
                // The prompt asked to 'periksa' but usually seeders create data.
                // We'll use create() as per original file.

                ExamResultDetail::updateOrCreate(
                    [
                        'exam_session_id' => $session->id,
                        'exam_question_id' => $question->id,
                    ],
                    [
                        'student_answer' => $studentAnswer,
                        'is_correct' => $isCorrect,
                        'score_earned' => $scoreEarned,
                        'correction_notes' => ($questionType === \App\Enums\QuestionTypeEnum::Essay && $scoreEarned > 0) ? 'Dinilai otomatis oleh seeder' : null,
                        'answered_at' => now(),
                        'time_spent' => rand(10, 120),
                    ]
                );

                $totalDetails++;
            }
            $this->command->getOutput()->write("  -> Sesi ID {$session->id} (Percobaan {$session->attempt_number}) diisi dengan {$totalDetails} detail jawaban.\n");
            $successfulDetails += $totalDetails;
        }

        $this->command->info('----------------------------------------------------');
        $this->command->info("✅ ExamResultDetail Seeder selesai. Total Detail Dibuat: {$successfulDetails}. Sesi Dilewati: {$skippedSessions}");
        $this->command->info('----------------------------------------------------');
    }
}
