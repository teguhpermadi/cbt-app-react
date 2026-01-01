<?php

namespace App\Console\Commands;

use App\Models\AcademicYear;
use App\Models\QuestionBank;
use App\Models\Subject;
use App\Models\User;
use App\Models\Grade;
use App\Services\QuestionImportService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TestQuestionImport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:question-import {file : Filename in storage/app/temp}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test import questions from Word file in temp folder';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $fileName = $this->argument('file');

        // Check if file exists in storage/app/temp
        $tempDir = storage_path('app/temp');
        $filePath = $tempDir . DIRECTORY_SEPARATOR . $fileName;

        if (!file_exists($filePath)) {
            $this->warn("File not found: {$filePath}");

            if ($this->confirm('Do you want to generate a sample template instead?', true)) {
                $templateService = new \App\Services\QuestionTemplateService();
                $generatedPath = $templateService->generateTemplate();

                // Move to temp
                if (!is_dir($tempDir)) mkdir($tempDir, 0755, true);

                $newPath = $tempDir . DIRECTORY_SEPARATOR . 'test_template.docx';
                copy($generatedPath, $newPath);

                $filePath = $newPath;
                $this->info("Generated sample template at: {$filePath}");
            } else {
                return 1;
            }
        }

        $this->info("Found file: {$filePath}");

        // Create dummy data
        $this->info('Creating dummy Subject and QuestionBank...');

        try {
            DB::beginTransaction();

            // Find or create a user for author
            $user = User::first();
            if (!$user) {
                $user = User::factory()->create();
            }

            // Get Active Academic Year
            $academicYear = AcademicYear::where('is_active', true)->first();
            if (!$academicYear) {
                // Assuming AcademicYear factory exists or create one if not
                $academicYear = AcademicYear::first() ?? AcademicYear::create([
                    'name' => '2024/2025',
                    'semester' => 'ganjil',
                    'is_active' => true
                ]);
            }

            // Get Grade
            $grade = Grade::first();
            if (!$grade) {
                $grade = Grade::create(['name' => 'Grade 10']);
            }

            // Create Subject with correct fields
            $subject = Subject::firstOrCreate(
                ['name' => 'Test Subject'],
                [
                    'code' => 'TEST-101',
                    'description' => 'Test Subject for import',
                    'academic_year_id' => $academicYear->id,
                    'grade_id' => $grade->id,
                    'user_id' => $user->id,
                ]
            );

            // Create QuestionBank
            $questionBank = QuestionBank::create([
                'name' => 'Test Import ' . now()->format('Y-m-d H:i:s'),
                'subject_id' => $subject->id,
                'user_id' => $user->id,
                'description' => 'Created by test command',
                'is_public' => false,
            ]);

            $this->info("Created QuestionBank ID: {$questionBank->id}");

            // Run Import Service
            $this->info('Running QuestionImportService...');

            $service = new QuestionImportService();
            $result = $service->parseWordDocument($filePath, $questionBank->id);

            if ($result['success']) {
                $this->info("✅ SUCCESS!");
                $this->info("Total Questions: " . count($result['questions']));

                if (!empty($result['errors'])) {
                    $this->warn("⚠️  Import completed with " . count($result['errors']) . " errors:");
                    foreach ($result['errors'] as $error) {
                        $this->warn("   - {$error}");
                    }
                }

                foreach ($result['questions'] as $index => $question) {
                    $this->line("  [" . ($index + 1) . "] {$question->question_type->value} - Points: {$question->score_value}");
                    $this->line("      Content: " . substr(strip_tags($question->content), 0, 50) . "...");
                    $this->line("      Options: " . $question->options->count());
                }

                DB::commit();
                $this->info("\nDatabase transaction commited.");
            } else {
                $this->error("❌ FAILED!");
                foreach ($result['errors'] as $error) {
                    $this->error(" - {$error}");
                }

                DB::rollBack();
                $this->warn("\nDatabase transaction rolled back.");
            }
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Exception: " . $e->getMessage());
            $this->error($e->getTraceAsString());
        }
    }
}
