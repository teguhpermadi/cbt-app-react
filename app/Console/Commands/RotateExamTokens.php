<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RotateExamTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'exam:rotate-tokens';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Rotate exam tokens for active exams every 15 minutes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = now();

        // Cari ujian yang sedang aktif atau akan datang (belum selesai) dan sudah dipublish
        // Kita asumsikan token perlu digenerate/diupdate untuk ujian yang belum berakhir
        $exams = \App\Models\Exam::where('is_published', true)
            ->where('end_time', '>=', $now)
            ->get();

        $count = 0;
        foreach ($exams as $exam) {
            $exam->update([
                'token' => \App\Models\Exam::generateToken(),
            ]);
            $count++;
        }

        $this->info("Successfully rotated tokens for {$count} active exams.");
    }
}
