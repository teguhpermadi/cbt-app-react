<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\Question;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection; // Import Collection

class ExamQuestionSeeder extends Seeder
{
    public function run(): void
    {
        // Deprecated: Logika pengisian soal sudah dipindahkan ke ExamSeeder
        // untuk memastikan konsistensi antara Bank Soal yang dipilih dan soal yang disalin.
        // File ini dibiarkan ada untuk kompatibilitas jika dipanggil di DatabaseSeeder,
        // tapi tidak melakukan apa-apa agar tidak terjadi duplikasi soal.

        $this->command->info('⚠️ ExamQuestionSeeder dilewati karena logika sudah handle di ExamSeeder.');
    }
}
