<?php

namespace App\Exports;

use App\Exports\Sheets\ItemAnalysisSheet;
use App\Exports\Sheets\QuestionAnalysisSheet;
use App\Exports\Sheets\StudentReportSheet;
use App\Models\Exam;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ExamAnalysisExport implements WithMultipleSheets
{
    use Exportable;

    protected $exam;

    public function __construct(Exam $exam)
    {
        $this->exam = $exam;
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [];

        $sheets[] = new StudentReportSheet($this->exam);
        $sheets[] = new QuestionAnalysisSheet($this->exam);
        $sheets[] = new ItemAnalysisSheet($this->exam);

        return $sheets;
    }
}
