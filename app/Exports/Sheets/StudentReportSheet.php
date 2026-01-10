<?php

namespace App\Exports\Sheets;

use App\Models\Exam;
use App\Models\ExamSession;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class StudentReportSheet implements FromCollection, WithTitle, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $exam;

    public function __construct(Exam $exam)
    {
        $this->exam = $exam;
    }

    public function collection()
    {
        return ExamSession::where('exam_id', $this->exam->id)
            ->where('is_finished', true)
            ->with(['user', 'examResultDetails'])
            ->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Siswa',
            'Email',
            'Waktu Mulai',
            'Waktu Selesai',
            'Durasi (Menit)',
            'Benar',
            'Salah',
            'Nilai Akhir',
        ];
    }

    public function map($session): array
    {
        static $no = 0;
        $no++;

        $start = $session->start_time ? \Carbon\Carbon::parse($session->start_time) : null;
        $finish = $session->finish_time ? \Carbon\Carbon::parse($session->finish_time) : null;
        $duration = $session->duration_taken; // Assuming this is already stored mostly correct, or calculate diff

        // Calculating correct/wrong manually if not stored, but usually it's in details
        // Assuming we count strictly from details for accuracy
        $correct = $session->examResultDetails->where('is_correct', true)->count();
        $wrong = $session->examResultDetails->where('is_correct', false)->count();

        // Or if total_questions is known, wrong = total - correct (but skipped?)
        // Let's stick to details count.

        return [
            $no,
            $session->user->name,
            $session->user->email,
            $start ? $start->format('Y-m-d H:i:s') : '-',
            $finish ? $finish->format('Y-m-d H:i:s') : '-',
            $duration,
            $correct,
            $wrong,
            $session->final_score
        ];
    }

    public function title(): string
    {
        return 'Laporan Siswa';
    }
}
