<?php

namespace App\Exports\Sheets;

use App\Models\Exam;
use App\Models\ExamSession;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class QuestionAnalysisSheet implements FromCollection, WithTitle, WithHeadings, ShouldAutoSize, WithStyles
{
    protected $exam;
    protected $sessions;

    public function __construct(Exam $exam)
    {
        $this->exam = $exam;
        // Fetch sessions once to use for columns
        $this->sessions = ExamSession::where('exam_id', $this->exam->id)
            ->where('is_finished', true)
            ->with(['user', 'examResultDetails'])
            ->get();
    }

    public function collection()
    {
        // Get all questions
        // We use the exam's questions. Assuming they are ordered by question_number.
        $questions = $this->exam->examQuestions()->orderBy('question_number')->get();

        $rows = [];

        foreach ($questions as $question) {
            $row = [
                $question->question_number,
                strip_tags($question->content), // Removing HTML tags for cleaner Excel
                $question->question_type instanceof \UnitEnum ? $question->question_type->value : $question->question_type,
            ];


            // For each student (session), find the score for this question
            foreach ($this->sessions as $session) {
                $detail = $session->examResultDetails->where('exam_question_id', $question->id)->first();
                $row[] = $detail ? (string)$detail->score_earned : '0';
            }

            $rows[] = $row;
        }

        return new Collection($rows);
    }

    public function headings(): array
    {
        $headings = [
            'No',
            'Soal (Preview)',
            'Tipe',
        ];

        foreach ($this->sessions as $session) {
            $headings[] = $session->user->name;
        }

        return $headings;
    }

    public function title(): string
    {
        return 'Analisis Per Soal';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]], // Bold first row
        ];
    }
}
