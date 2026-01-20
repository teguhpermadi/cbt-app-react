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
use PhpOffice\PhpWord\Element\Image;
use Spatie\MediaLibrary\HasMedia;

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
     * @param string $authorId ULID of key user
     * @return array ['success' => bool, 'questions' => array, 'errors' => array]
     */
    public function parseWordDocument(string $filePath, string $questionBankId, string $authorId): array
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
                    $question = $this->parseRow($row, $authorId);
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
            foreach ($section->getElements() as $element) {
                if ($element instanceof Table) {
                    foreach ($element->getRows() as $row) {
                        $cells = $row->getCells();
                        $rowValues = [];
                        foreach ($cells as $cell) {
                            $rowValues[] = $this->extractCellContent($cell);
                        }

                        // Skip strictly empty rows
                        if (empty(array_filter($rowValues, fn($v) => !empty(trim($v['text']))))) {
                            continue;
                        }

                        $rows[] = $rowValues;
                    }
                }
            }
        }

        return $rows;
    }


    /**
     * Extract text and images from a cell
     */
    protected function extractCellContent($cell): array
    {
        $images = [];
        $text = $this->recursiveExtractText($cell, $images);
        return [
            'text' => trim($text),
            'images' => $images
        ];
    }

    /**
     * Recursively extract text from any element, preserving intentional line breaks
     */
    protected function recursiveExtractText($element, &$images = []): string
    {
        $text = '';

        if ($element instanceof TextBreak) {
            return "\n";
        }

        if ($element instanceof Text) {
            return $element->getText();
        }

        if ($element instanceof Image) {
            $index = count($images);
            $images[] = $element;
            // return "[IMG:{$index}]"; // Commented out per user request
            return "";
        }

        if (method_exists($element, 'getElements')) {
            foreach ($element->getElements() as $child) {
                $text .= $this->recursiveExtractText($child, $images);
            }

            // Elements that act as block containers in Word (like paragraphs/TextRuns)
            // should usually end with a newline to separate them from the next block.
            if (
                $element instanceof TextRun ||
                get_class($element) === 'PhpOffice\PhpWord\Element\ListItem' ||
                get_class($element) === 'PhpOffice\PhpWord\Element\Table' ||
                get_class($element) === 'PhpOffice\PhpWord\Element\Title'
            ) {
                $text .= "\n";
            }
        } elseif (method_exists($element, 'getText')) {
            $text .= $element->getText();
        }

        return $text;
    }

    /**
     * Process placeholders and attach images to model
     */
    protected function processPlaceholdersAndAttach(HasMedia $model, string $text, array $images, string $collection)
    {
        if (empty($images)) return;

        /* 
        // Find all placeholders [IMG:X] - Commented out per user request
        preg_match_all('/\[IMG:(\d+)\]/', $text, $matches);
        
        if (empty($matches[0])) return;

        foreach ($matches[1] as $index) {
            $index = (int)$index;
            if (isset($images[$index])) {
                $image = $images[$index];
                $this->attachPhpWordImage($model, $image, $collection);
            }
        }
        */

        // Just attach all images found if placeholders are disabled
        foreach ($images as $image) {
            $this->attachPhpWordImage($model, $image, $collection);
        }
    }

    /**
     * Attach a PHPWord Image element to a Spatie Media model
     */
    protected function attachPhpWordImage(HasMedia $model, Image $image, string $collection)
    {
        try {
            $source = $image->getSource();
            $binaryData = null;
            $extension = $image->getImageExtension() ?: 'png';

            // Check if source is base64 data URI
            if (str_starts_with($source, 'data:image')) {
                $model->addMediaFromBase64($source)
                    ->usingFileName('image_' . uniqid() . '.' . $extension)
                    ->toMediaCollection($collection);
                return;
            }

            if (method_exists($image, 'getImageStringData')) {
                $binaryData = $image->getImageStringData();
            } elseif (file_exists($source)) {
                $binaryData = file_get_contents($source);
                $extension = pathinfo($source, PATHINFO_EXTENSION);
            }

            if (!$binaryData) {
                Log::warning("Gagal mendapatkan data biner untuk gambar dari source: " . substr($source, 0, 100));
                return;
            }

            // Fix: PHPWord sometimes returns hex-encoded string instead of raw binary
            if (ctype_xdigit($binaryData) && strlen($binaryData) > 128) {
                $binaryData = hex2bin($binaryData);
            }

            // Detect mime type and extension from binary data
            $finfo = new \finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->buffer($binaryData);

            $extensionMap = [
                'image/jpeg' => 'jpg',
                'image/png' => 'png',
                'image/gif' => 'gif',
                'image/bmp' => 'bmp',
                'image/x-ms-bmp' => 'bmp',
                'image/webp' => 'webp',
                'image/svg+xml' => 'svg',
            ];

            if (isset($extensionMap[$mimeType])) {
                $extension = $extensionMap[$mimeType];
            }

            $filename = 'image_' . uniqid() . '.' . $extension;
            Log::debug("Attaching image: " . $filename . " (Mime: {$mimeType}) | Size: " . strlen($binaryData) . " | Hex: " . bin2hex(substr($binaryData, 0, 16)));

            $model->addMediaFromString($binaryData)
                ->usingFileName($filename)
                ->toMediaCollection($collection);
        } catch (Exception $e) {
            Log::warning("Gagal melampirkan gambar ke koleksi {$collection}: " . $e->getMessage());
        }
    }

    /**
     * Parse a single row from table
     * Expected format: [Tipe Soal, Pertanyaan, Opsi, Kunci, Poin]
     *
     * @param array $cells Array of 5 cell texts
     * @return Question|null
     */
    protected function parseRow(array $cells, string $authorId): ?Question
    {
        if (count($cells) < 4) { // At least Type, Question, Key
            return null;
        }

        // Fill missing columns with empty string/images structure
        while (count($cells) < 6) {
            $cells[] = ['text' => '', 'images' => []];
        }

        [$typeCell, $questionCell, $optionsCell, $keyCell, $pointsCell, $tagsCell] = $cells;

        $typeStr = is_array($typeCell) ? $typeCell['text'] : $typeCell;
        $typeNormalized = strtoupper(trim($typeStr));

        // Skip header rows
        if (in_array($typeNormalized, ['TIPE SOAL', 'TYPE', 'QUESTION TYPE', 'NO', 'NUMBER', ''])) {
            return null;
        }

        // Validate question type
        $questionType = $this->parseQuestionType($typeStr);
        if (!$questionType) {
            if (empty($typeNormalized)) return null;
            throw new Exception("Tipe soal tidak valid: '{$typeStr}'");
        }

        try {
            DB::beginTransaction();

            $question = $this->createQuestion([
                'type' => $questionType,
                'content' => $questionCell['text'],
                'points' => is_numeric($pointsCell['text']) ? intval($pointsCell['text']) : 10,
                'author_id' => $authorId,
            ]);

            // Attach images to question
            $this->processPlaceholdersAndAttach($question, $questionCell['text'], $questionCell['images'], 'question_content');

            // Create options based on type
            $this->createOptions($question, $questionType, $optionsCell, $keyCell['text']);

            // Attach Tags
            if (!empty(trim($tagsCell['text']))) {
                // Split by comma, trim, and filter empty
                $tags = array_values(array_filter(array_map('trim', explode(',', $tagsCell['text']))));
                if (!empty($tags)) {
                    $question->attachTags($tags);
                }
            }

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
            'NUMERICAL_INPUT' => QuestionTypeEnum::NumericalInput,
            default => null,
        };
    }

    /**
     * Create Question model
     *
     * @param array $data
     * @return Question
     */
    /**
     * Process text to convert specific patterns to Rich Text HTML components
     * 1. $...$ -> MathComponent
     * 2. Javanese chars -> JavaneseComponent
     * 3. Arabic chars -> ArabicComponent
     */
    protected function processRichText(?string $text): string
    {
        if (empty($text)) {
            return '';
        }

        // 1. Convert Latex: $equation$ -> math-component
        $text = preg_replace_callback(
            '/\$([^$]+)\$/',
            function ($matches) {
                $latex = htmlspecialchars($matches[1], ENT_QUOTES);
                return '<span data-type="math-component" latex="' . $latex . '"></span>';
            },
            $text
        );

        // 2. Convert Javanese (Hanacaraka) - Unicode Block A980–A9DF
        $text = preg_replace_callback(
            '/[\x{A980}-\x{A9DF}]+/u',
            function ($matches) {
                $content = htmlspecialchars($matches[0], ENT_QUOTES);
                return '<span data-type="javanese-component" text="' . $content . '"></span>';
            },
            $text
        );

        // 3. Convert Arabic - Unicode Block 0600–06FF and supplements
        $text = preg_replace_callback(
            '/\p{Arabic}+/u',
            function ($matches) {
                $content = htmlspecialchars($matches[0], ENT_QUOTES);
                return '<span data-type="arabic-component" text="' . $content . '"></span>';
            },
            $text
        );

        // Enhance layout: Wrap in paragraph if it looks like a block
        $lines = explode("\n", $text);
        if (count($lines) > 1) {
            $html = '';
            foreach ($lines as $line) {
                if (trim($line) !== '') {
                    $html .= '<p>' . $line . '</p>';
                }
            }
            return $html;
        }

        return $text;
    }

    protected function createQuestion(array $data): Question
    {
        return Question::create([
            'question_bank_id' => $this->questionBank->id,
            'question_type' => $data['type'],
            'difficulty_level' => DifficultyLevelEnum::Medium, // Default: sedang
            'timer' => TimerEnum::ThirtySeconds, // Default: 30 detik (karena DB Constraint NOT NULL)
            'content' => $this->processRichText($data['content']),
            'score_value' => (int) $data['points'],
            'is_active' => true,
            'is_approved' => true, // Auto info approved for uploaded questions
            'options' => [], // Init empty JSON
            'key_answer' => [], // Init empty JSON
            'author_id' => $data['author_id'],
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
    protected function createOptions(Question $question, QuestionTypeEnum $type, array $optionsCell, string $keyAnswer): void
    {
        match ($type) {
            QuestionTypeEnum::MultipleChoice => $this->handleMultipleChoice($question, $optionsCell, $keyAnswer),
            QuestionTypeEnum::MultipleSelection => $this->handleMultipleSelection($question, $optionsCell, $keyAnswer),
            QuestionTypeEnum::TrueFalse => $this->handleTrueFalse($question, $optionsCell, $keyAnswer),
            QuestionTypeEnum::Matching => $this->handleMatching($question, $optionsCell),
            QuestionTypeEnum::Ordering => $this->handleOrdering($question, $optionsCell),
            QuestionTypeEnum::Essay => $this->handleEssay($question, $keyAnswer),
            QuestionTypeEnum::NumericalInput => $this->handleNumericalInput($question, $optionsCell, $keyAnswer),
            default => throw new Exception("Handler untuk tipe soal {$type->value} belum diimplementasikan."),
        };
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
    protected function handleMultipleChoice(Question $question, array $optionsCell, string $keyAnswer): void
    {
        $options = $this->splitOptions($optionsCell['text']);
        $correctKey = strtoupper(trim($keyAnswer));

        if (count($options) < 2) {
            throw new Exception("Soal Multiple Choice harus memiliki minimal 2 opsi jawaban.");
        }

        foreach ($options as $index => $optionText) {
            if (preg_match('/^([A-Z])\.\s*(.+)$/si', trim($optionText), $matches)) {
                $key = strtoupper($matches[1]);
                $content = trim($matches[2]);
            } else {
                $key = chr(65 + $index);
                $content = trim($optionText);
            }

            $option = Option::create([
                'question_id' => $question->id,
                'option_key' => $key,
                'content' => $this->processRichText($content),
                'order' => $index,
                'is_correct' => ($key === $correctKey),
            ]);

            // Attach images found in this option's text
            $this->processPlaceholdersAndAttach($option, $optionText, $optionsCell['images'], 'option_media');
        }
    }

    protected function handleMultipleSelection(Question $question, array $optionsCell, string $keyAnswer): void
    {
        $options = $this->splitOptions($optionsCell['text']);
        $correctKeys = array_map('trim', explode(',', strtoupper($keyAnswer)));
        $correctKeys = array_map('strtoupper', $correctKeys);

        if (count($options) < 2) {
            throw new Exception("Soal Multiple Selection harus memiliki minimal 2 opsi jawaban.");
        }

        foreach ($options as $index => $optionText) {
            if (preg_match('/^([A-Z])\.\s*(.+)$/si', trim($optionText), $matches)) {
                $key = strtoupper($matches[1]);
                $content = trim($matches[2]);
            } else {
                $key = chr(65 + $index);
                $content = trim($optionText);
            }

            $option = Option::create([
                'question_id' => $question->id,
                'option_key' => $key,
                'content' => $this->processRichText($content),
                'order' => $index,
                'is_correct' => in_array($key, $correctKeys),
            ]);

            // Attach images found in this option's text
            $this->processPlaceholdersAndAttach($option, $optionText, $optionsCell['images'], 'option_media');
        }
    }

    /**
     * Handle True/False options
     *
     * @param Question $question
     * @param array $optionsCell
     * @param string $keyAnswer "TRUE", "FALSE" or "A", "B" etc.
     * @return void
     */
    protected function handleTrueFalse(Question $question, array $optionsCell, string $keyAnswer): void
    {
        $options = $this->splitOptions($optionsCell['text']);
        $rawCorrectKey = strtoupper(trim($keyAnswer));

        // Fallback to default Benar/Salah if options cell is empty
        if (empty($options)) {
            $options = ['A. Benar', 'B. Salah'];
        }

        // Standardize the correct key to 'T' or 'F'
        // Map common true/false indicators to T/F
        $standardizedCorrectKey = match ($rawCorrectKey) {
            'A', 'TRUE', 'BENAR', 'YA', '1', 'T' => 'T',
            'B', 'FALSE', 'SALAH', 'TIDAK', '0', 'F' => 'F',
            default => $rawCorrectKey,
        };

        foreach ($options as $index => $optionText) {
            // Extract content without the A. B. prefix
            if (preg_match('/^([A-Z])\.\s*(.+)$/si', trim($optionText), $matches)) {
                $content = trim($matches[2]);
            } else {
                $content = trim($optionText);
            }

            // Force key to 'T' for first option and 'F' for second option
            $mappedKey = ($index === 0) ? 'T' : 'F';

            // If there are more than 2 options (unusual for T/F), 
            // fallback to sequential letters after F (G, H, I...)
            if ($index > 1) {
                $mappedKey = chr(70 + ($index - 1));
            }

            $option = Option::create([
                'question_id' => $question->id,
                'option_key' => $mappedKey,
                'content' => $this->processRichText($content),
                'order' => $index,
                'is_correct' => ($mappedKey === $standardizedCorrectKey),
            ]);

            $this->processPlaceholdersAndAttach($option, $optionText, $optionsCell['images'], 'option_media');
        }
    }

    /**
     * Handle Matching options
     * Format: "Left 1 :: Right 1\nLeft 2 :: Right 2"
     *
     * @param Question $question
     * @param string $optionsText
     * @return void
     */
    protected function handleMatching(Question $question, array $optionsCell): void
    {
        $pairs = $this->splitOptions($optionsCell['text']);

        foreach ($pairs as $index => $pairText) {
            $parts = explode('::', $pairText);
            if (count($parts) !== 2) {
                continue;
            }

            $leftContent = trim($parts[0]);
            $rightContent = trim($parts[1]);

            $leftKey = 'L' . ($index + 1);
            $rightKey = 'R' . ($index + 1);

            $leftOption = Option::create([
                'question_id' => $question->id,
                'option_key' => $leftKey,
                'content' => $this->processRichText($leftContent),
                'order' => $index * 2,
                'is_correct' => false,
                'metadata' => [
                    'side' => 'left',
                    'pair_id' => $index + 1,
                    'match_with' => $rightKey,
                ],
            ]);

            $rightOption = Option::create([
                'question_id' => $question->id,
                'option_key' => $rightKey,
                'content' => $this->processRichText($rightContent),
                'order' => $index * 2 + 1,
                'is_correct' => false,
                'metadata' => [
                    'side' => 'right',
                    'pair_id' => $index + 1,
                    'match_with' => $leftKey,
                ],
            ]);

            // Attach images if found in respective text parts
            $this->processPlaceholdersAndAttach($leftOption, $leftContent, $optionsCell['images'], 'option_media');
            $this->processPlaceholdersAndAttach($rightOption, $rightContent, $optionsCell['images'], 'option_media');
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
    protected function handleOrdering(Question $question, array $optionsCell): void
    {
        $items = $this->splitOptions($optionsCell['text']);

        foreach ($items as $index => $itemText) {
            if (preg_match('/^(\d+)\.\s*(.+)$/si', trim($itemText), $matches)) {
                $correctPosition = intval($matches[1]);
                $content = trim($matches[2]);
            } else {
                $correctPosition = $index + 1;
                $content = trim($itemText);
            }

            $option = Option::create([
                'question_id' => $question->id,
                'option_key' => (string)($index + 1),
                'content' => $this->processRichText($content),
                'order' => $index,
                'is_correct' => false,
                'metadata' => [
                    'correct_position' => $correctPosition,
                ],
            ]);

            $this->processPlaceholdersAndAttach($option, $itemText, $optionsCell['images'], 'option_media');
        }
    }

    /**
     * Handle Numerical Input question
     *
     * @param Question $question
     * @param array $optionsCell
     * @param string $keyAnswer The correct numerical answer
     * @return void
     */
    protected function handleNumericalInput(Question $question, array $optionsCell, string $keyAnswer): void
    {
        // Extract the numerical value from keyAnswer
        // Handle cases like "5,0" vs "5.0"
        $sanitizedValue = str_replace(',', '.', trim($keyAnswer));
        $numericValue = is_numeric($sanitizedValue) ? (float)$sanitizedValue : 0;

        $option = Option::create([
            'question_id' => $question->id,
            'option_key' => 'NUM',
            'content' => (string)$numericValue,
            'order' => 0,
            'is_correct' => true,
            'metadata' => [
                'tolerance' => 0.01,
                'unit' => null,
                'correct_answer' => $numericValue,
            ],
        ]);

        // Attach any images found in the options cell (though usually empty for numerical)
        $this->processPlaceholdersAndAttach($option, $optionsCell['text'], $optionsCell['images'], 'option_media');
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
                'rubric' => $this->processRichText($rubric),
                'expected_answer' => $this->processRichText($rubric),
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

        // Normalize text: if options start on the same line (e.g., "A. Yes B. No"),
        // we add a newline before each option key (except the first one if it starts the string).
        // This makes the subsequent newline split work correctly.
        $text = preg_replace('/(?<=\S)\s+([A-Z]\.)/i', "\n$1", trim($text));

        // Split by newlines (handles \r\n, \r, and \n)
        $options = preg_split('/\r\n|\r|\n/', $text);

        // Filter empty lines and trim
        return array_values(array_filter(array_map('trim', $options)));
    }
}
