<?php

namespace App\Exports\Sheets;

use App\Models\Exam;
use App\Models\ExamAnalysis;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithMapping;

class ItemAnalysisSheet implements FromCollection, WithTitle, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $exam;
    protected $analysis;

    public function __construct(Exam $exam)
    {
        $this->exam = $exam;
        $this->analysis = ExamAnalysis::where('exam_id', $exam->id)
            ->with(['itemAnalyses.examQuestion'])
            ->latest()
            ->first();
    }

    public function collection()
    {
        return $this->analysis ? $this->analysis->itemAnalyses : collect([]);
    }

    public function headings(): array
    {
        return [
            'No Soal',
            'Konten Soal (Preview)',
            'Tipe Soal',
            'Tingkat Kesulitan (P)',
            'Kategori Kesulitan',
            'Daya Beda (D)',
            'Kategori Daya Beda',
            'Rekomendasi',
        ];
    }

    public function map($item): array
    {
        $p = $item->difficulty_index;
        $diffLabel = '-';
        if ($p !== null) {
            if ($p > 0.7) $diffLabel = 'Mudah';
            elseif ($p < 0.3) $diffLabel = 'Sukar';
            else $diffLabel = 'Sedang';
        }

        $d = $item->discrimination_index;
        $discLabel = '-';
        if ($d !== null) {
            if ($d >= 0.4) $discLabel = 'Sangat Baik';
            elseif ($d >= 0.3) $discLabel = 'Baik';
            elseif ($d >= 0.2) $discLabel = 'Cukup';
            else $discLabel = 'Buruk';
        }

        $question = $item->exam_question;

        // Safety fallback: try to find exam question manually if relation failed for some reason
        if (!$question && $item->exam_question_id) {
            $question = \App\Models\ExamQuestion::find($item->exam_question_id);
        }

        $content = '';
        if ($question) {
            $stripped = trim(strip_tags($question->content));
            if (empty($stripped) && !empty($question->content)) {
                $content = '[Konten Mengandung Gambar/Media]';
            } else {
                $content = $stripped;
            }
        }

        $questionNumber = $question ? $question->question_number : '-';
        if (!$question && $item->question_id) {
            $questionNumber = 'Q-ID:' . substr($item->question_id, 0, 8);
        }

        $questionType = '-';
        if ($question && $question->question_type) {
            $questionType = $question->question_type instanceof \App\Enums\QuestionTypeEnum
                ? $question->question_type->getLabel()
                : $question->question_type;
        }

        return [
            $questionNumber,
            $content ?: 'Konten tidak tersedia',
            $questionType,
            $item->difficulty_index,
            $diffLabel,
            $item->discrimination_index,
            $discLabel,
            $item->analysis_recommendation
        ];
    }

    public function title(): string
    {
        return 'Analisis Butir Soal';
    }
}
