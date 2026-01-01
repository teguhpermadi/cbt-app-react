<?php

namespace App\Services;

use App\Enums\QuestionTypeEnum;
use App\Enums\DifficultyLevelEnum;
use App\Enums\TimerEnum;
use App\Models\Option;
use App\Models\Question;
use App\Models\QuestionBank;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Element\TextRun;
use PhpOffice\PhpWord\Element\TextBreak;
use PhpOffice\PhpWord\Element\Text;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Element\Table;

class QuestionImportService
{
    protected $questionBank;
    protected $createdQuestions = [];
    protected $errors = [];

    /**
     * Parse Word document and create questions
     *
     * @param string $filePath Full path to uploaded .docx file
     * @param string $questionBankId ULID of question bank
     * @return array ['success' => bool, 'questions' => array, 'errors' => array]
     */
    public function parseWordDocument(string $filePath, string $questionBankId): array
    {
        try {
            $this->questionBank = QuestionBank::findOrFail($questionBankId);

            // Load Word document
            $phpWord = IOFactory::load($filePath);

            // Extract table rows
            $rows = $this->extractTableRows($phpWord);

            if (empty($rows)) {
                throw new Exception('Tidak ada tabel ditemukan dalam dokumen Word atau tabel kosong.');
            }

            DB::beginTransaction();

            // Process each row (skip header row)
            foreach ($rows as $index => $row) {
                if ($index === 0) {
                    continue; // Skip header
                }

                try {
                    $question = $this->parseRow($row);
                    if ($question) {
                        $this->createdQuestions[] = $question;
                    }
                } catch (Exception $e) {
                    $this->errors[] = "Row " . ($index + 1) . ": " . $e->getMessage();
                    Log::error("Question import error at row " . ($index + 1), [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                }
            }

            DB::commit();

            return [
                'success' => true,
                'questions' => $this->createdQuestions,
                'errors' => $this->errors,
                'total' => count($this->createdQuestions),
            ];
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Question import failed', ['error' => $e->getMessage()]);

            return [
                'success' => false,
                'questions' => [],
                'errors' => [$e->getMessage()],
                'total' => 0,
            ];
        }
    }

    /**
     * Extract all table rows from Word document
     *
     * @param \PhpOffice\PhpWord\PhpWord $phpWord
     * @return array Array of rows, each row is array of cell texts
     */
    protected function extractTableRows(\PhpOffice\PhpWord\PhpWord $phpWord): array
    {
        $rows = [];
        $sections = $phpWord->getSections();

        foreach ($sections as $section) {
            $elements = $section->getElements();

            foreach ($elements as $element) {
                if ($element instanceof \PhpOffice\PhpWord\Element\Table) {
                    $tableRows = $element->getRows();

                    foreach ($tableRows as $rowIndex => $row) {
                        $cells = $row->getCells();

                        $rowValues = [];
                        foreach ($cells as $cell) {
                            $rowValues[] = $this->extractCellContent($cell);
                        }

                        // Debug content
                        // echo "  Content: " . implode(" | ", array_map(fn($t) => substr($t, 0, 20), $rowValues)) . "\n";

                        if (empty(array_filter($rowValues, fn($v) => !empty(trim($v))))) {
                            continue;
                        }


                        $rows[] = $rowValues;
                    }
                }
            }
        }

        return $rows;
    }

    protected function extractCellContent($cell): string
    {
        return trim($this->recursiveExtractText($cell));
    }

    /**
     * Recursively extract text from any element, preserving intentional line breaks
     */
    protected function recursiveExtractText($element): string
    {
        $text = '';

        if ($element instanceof TextBreak) {
            return "\n";
        }

        if ($element instanceof Text) {
            return $element->getText();
        }

        if (method_exists($element, 'getElements')) {
            foreach ($element->getElements() as $child) {
                $text .= $this->recursiveExtractText($child);
            }

            // Elements that act as block containers in Word (like paragraphs/TextRuns)
            // should usually end with a newline to separate them from the next block.
            if (
                $element instanceof TextRun ||
                get_class($element) === 'PhpOffice\PhpWord\Element\ListItem' ||
                get_class($element) === 'PhpOffice\PhpWord\Element\Table'
            ) {
                $text .= "\n";
            }
        } elseif (method_exists($element, 'getText')) {
            $text .= $element->getText();
        }

        return $text;
    }

    /**
     * Parse a single row from table
     * Expected format: [Tipe Soal, Pertanyaan, Opsi, Kunci, Poin]
     *
     * @param array $cells Array of 5 cell texts
     * @return Question|null
     */
    protected function parseRow(array $cells): ?Question
    {
        if (count($cells) < 4) { // At least Type, Question, Key
            return null;
        }

        // Fill missing columns with empty string if less than 5
        $cells = array_pad($cells, 5, '');
        [$typeStr, $questionText, $optionsText, $keyAnswer, $points] = $cells;

        $typeNormalized = strtoupper(trim($typeStr));

        // Skip header rows
        if (in_array($typeNormalized, ['TIPE SOAL', 'TYPE', 'QUESTION TYPE', 'NO', 'NUMBER', ''])) {
            return null;
        }

        // Validate question type
        $questionType = $this->parseQuestionType($typeStr);
        if (!$questionType) {
            // If it doesn't look like a type, but also not a known header, it might be a malformed row
            // We ignore it silently if it's likely a continued row or empty first cell
            if (empty($typeNormalized)) return null;

            throw new Exception("Tipe soal tidak valid: '{$typeStr}'");
        }

        try {
            DB::beginTransaction();

            $question = $this->createQuestion([
                'type' => $questionType,
                'content' => $questionText,
                'points' => is_numeric($points) ? intval($points) : 10,
            ]);

            // Create options based on type
            $this->createOptions($question, $questionType, $optionsText, $keyAnswer);

            DB::commit();
            return $question;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Gagal mengimport baris: " . $e->getMessage(), ['cells' => $cells]);
            throw $e;
        }
    }

    /**
     * Parse question type string to enum
     *
     * @param string $typeStr
     * @return QuestionTypeEnum|null
     */
    protected function parseQuestionType(string $typeStr): ?QuestionTypeEnum
    {
        $typeStr = strtoupper(trim($typeStr));

        return match ($typeStr) {
            'MULTIPLE_CHOICE' => QuestionTypeEnum::MultipleChoice,
            'MULTIPLE_SELECTION' => QuestionTypeEnum::MultipleSelection,
            'TRUE_FALSE' => QuestionTypeEnum::TrueFalse,
            'MATCHING' => QuestionTypeEnum::Matching,
            'ORDERING' => QuestionTypeEnum::Ordering,
            'ESSAY' => QuestionTypeEnum::Essay,
            default => null,
        };
    }

    /**
     * Create Question model
     *
     * @param array $data
     * @return Question
     */
    protected function createQuestion(array $data): Question
    {
        return Question::create([
            'question_bank_id' => $this->questionBank->id,
            'question_type' => $data['type'],
            'difficulty_level' => DifficultyLevelEnum::Medium, // Default: sedang
            'timer' => TimerEnum::ThirtySeconds, // Default: 30 detik (karena DB Constraint NOT NULL)
            'content' => $data['content'],
            'score_value' => (int) $data['points'],
            'is_active' => true,
            'is_approved' => true, // Auto info approved for uploaded questions
            'options' => [], // Init empty JSON
            'key_answer' => [], // Init empty JSON
        ]);
    }
    /**
     * Create options based on question type
     *
     * @param Question $question
     * @param QuestionTypeEnum $type
     * @param string $optionsText
     * @param string $keyAnswer
     * @return void
     */
    protected function createOptions(Question $question, QuestionTypeEnum $type, string $optionsText, string $keyAnswer): void
    {
        switch ($type) {
            case QuestionTypeEnum::MultipleChoice:
                $this->handleMultipleChoice($question, $optionsText, $keyAnswer);
                break;

            case QuestionTypeEnum::MultipleSelection:
                $this->handleMultipleSelection($question, $optionsText, $keyAnswer);
                break;

            case QuestionTypeEnum::TrueFalse:
                $this->handleTrueFalse($question, $keyAnswer);
                break;

            case QuestionTypeEnum::Matching:
                $this->handleMatching($question, $optionsText);
                break;

            case QuestionTypeEnum::Ordering:
                $this->handleOrdering($question, $optionsText);
                break;

            case QuestionTypeEnum::Essay:
                $this->handleEssay($question, $keyAnswer);
                break;
        }
    }

    /**
     * Handle Multiple Choice options
     * Format: "A. Option 1\nB. Option 2\nC. Option 3"
     *
     * @param Question $question
     * @param string $optionsText
     * @param string $keyAnswer
     * @return void
     */
    protected function handleMultipleChoice(Question $question, string $optionsText, string $keyAnswer): void
    {
        $options = $this->splitOptions($optionsText);
        $correctKey = strtoupper(trim($keyAnswer));

        foreach ($options as $index => $optionText) {
            // Parse "A. Option text" format
            if (preg_match('/^([A-Z])\.\s*(.+)$/s', trim($optionText), $matches)) {
                $key = $matches[1];
                $content = trim($matches[2]);
            } else {
                // Fallback: generate key from index
                $key = chr(65 + $index); // A, B, C, D...
                $content = trim($optionText);
            }

            Option::create([
                'question_id' => $question->id,
                'option_key' => $key,
                'content' => $content,
                'order' => $index,
                'is_correct' => ($key === $correctKey),
            ]);
        }
    }

    /**
     * Handle Multiple Selection options
     * Format same as multiple choice, but key answer is "A, D"
     *
     * @param Question $question
     * @param string $optionsText
     * @param string $keyAnswer
     * @return void
     */
    protected function handleMultipleSelection(Question $question, string $optionsText, string $keyAnswer): void
    {
        $options = $this->splitOptions($optionsText);

        // Parse correct answers "A, D" => ['A', 'D']
        $correctKeys = array_map('trim', explode(',', strtoupper($keyAnswer)));
        $correctKeys = array_map('strtoupper', $correctKeys);

        foreach ($options as $index => $optionText) {
            if (preg_match('/^([A-Z])\.\s*(.+)$/s', trim($optionText), $matches)) {
                $key = $matches[1];
                $content = trim($matches[2]);
            } else {
                $key = chr(65 + $index);
                $content = trim($optionText);
            }

            Option::create([
                'question_id' => $question->id,
                'option_key' => $key,
                'content' => $content,
                'order' => $index,
                'is_correct' => in_array($key, $correctKeys),
            ]);
        }
    }

    /**
     * Handle True/False options
     *
     * @param Question $question
     * @param string $keyAnswer "TRUE" or "FALSE"
     * @return void
     */
    protected function handleTrueFalse(Question $question, string $keyAnswer): void
    {
        $correctAnswer = strtoupper(trim($keyAnswer)) === 'TRUE';

        Option::create([
            'question_id' => $question->id,
            'option_key' => 'TRUE',
            'content' => 'Benar',
            'order' => 0,
            'is_correct' => $correctAnswer === true,
        ]);

        Option::create([
            'question_id' => $question->id,
            'option_key' => 'FALSE',
            'content' => 'Salah',
            'order' => 1,
            'is_correct' => $correctAnswer === false,
        ]);
    }

    /**
     * Handle Matching options
     * Format: "Left 1 :: Right 1\nLeft 2 :: Right 2"
     *
     * @param Question $question
     * @param string $optionsText
     * @return void
     */
    protected function handleMatching(Question $question, string $optionsText): void
    {
        $pairs = $this->splitOptions($optionsText);
        $leftIndex = 1;
        $rightIndex = 1;

        foreach ($pairs as $pairText) {
            // Split by ::
            $parts = explode('::', $pairText);
            if (count($parts) !== 2) {
                continue; // Skip invalid pairs
            }

            $leftContent = trim($parts[0]);
            $rightContent = trim($parts[1]);

            $leftKey = 'L' . $leftIndex;
            $rightKey = 'R' . $rightIndex;

            // Create left option
            Option::create([
                'question_id' => $question->id,
                'option_key' => $leftKey,
                'content' => $leftContent,
                'order' => ($leftIndex - 1) * 2,
                'is_correct' => false,
                'metadata' => [
                    'type' => 'left',
                    'match_with' => $rightKey,
                ],
            ]);

            // Create right option
            Option::create([
                'question_id' => $question->id,
                'option_key' => $rightKey,
                'content' => $rightContent,
                'order' => ($leftIndex - 1) * 2 + 1,
                'is_correct' => false,
                'metadata' => [
                    'type' => 'right',
                    'matched_by' => $leftKey,
                ],
            ]);

            $leftIndex++;
            $rightIndex++;
        }
    }

    /**
     * Handle Ordering options
     * Format: "1. First\n2. Second\n3. Third"
     *
     * @param Question $question
     * @param string $optionsText
     * @return void
     */
    protected function handleOrdering(Question $question, string $optionsText): void
    {
        $items = $this->splitOptions($optionsText);

        foreach ($items as $index => $itemText) {
            // Parse "1. Item text" format
            if (preg_match('/^(\d+)\.\s*(.+)$/s', trim($itemText), $matches)) {
                $correctPosition = intval($matches[1]);
                $content = trim($matches[2]);
            } else {
                $correctPosition = $index + 1;
                $content = trim($itemText);
            }

            Option::create([
                'question_id' => $question->id,
                'option_key' => (string)($index + 1),
                'content' => $content,
                'order' => $index,
                'is_correct' => false,
                'metadata' => [
                    'correct_position' => $correctPosition,
                ],
            ]);
        }
    }

    /**
     * Handle Essay question
     *
     * @param Question $question
     * @param string $rubric Rubric or expected answer
     * @return void
     */
    protected function handleEssay(Question $question, string $rubric): void
    {
        Option::create([
            'question_id' => $question->id,
            'option_key' => 'ESSAY',
            'content' => null,
            'order' => 0,
            'is_correct' => false,
            'metadata' => [
                'rubric' => $rubric,
                'expected_answer' => $rubric,
            ],
        ]);
    }

    /**
     * Split options text by line breaks
     *
     * @param string $text
     * @return array
     */
    protected function splitOptions(string $text): array
    {
        if (empty(trim($text)) || $text === '-') {
            return [];
        }

        // Split by newlines (handles \r\n, \r, and \n)
        $options = preg_split('/\r\n|\r|\n/', trim($text));

        // Filter empty lines and trim
        return array_values(array_filter(array_map('trim', $options)));
    }
}
