<?php

namespace App\Console\Commands;

use App\Enums\QuestionTypeEnum;
use App\Jobs\GenerateEssayRubricJob;
use App\Models\Question;
use Illuminate\Console\Command;
use function Laravel\Prompts\text;

class GenerateEssayRubric extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:essay-rubric';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate scoring rubric for essay questions using AI';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Welcome to AI Essay Rubric Generator!');
        $this->info('This tool will generate a grading rubric/answer key for essay questions.');
        $this->newLine();

        $questionId = text(
            label: 'Please enter the Question ID:',
            required: true,
            placeholder: 'E.g. 01jj...'
        );

        // Validate question exists
        $question = Question::find($questionId);

        if (!$question) {
            $this->error("Question with ID '{$questionId}' not found!");
            return Command::FAILURE;
        }

        // Validate question type is Essay
        if ($question->question_type !== QuestionTypeEnum::Essay) {
            $this->error("Question type must be 'Essay'. This question is of type: {$question->question_type->getLabel()}");
            return Command::FAILURE;
        }

        // Check if question has content
        if (empty($question->content)) {
            $this->error("Question content is empty. Cannot generate rubric.");
            return Command::FAILURE;
        }

        $this->info("Question found: " . strip_tags(substr($question->content, 0, 100)) . "...");
        $this->newLine();

        // Dispatch job
        $this->info("Dispatching job to generate rubric...");

        GenerateEssayRubricJob::dispatch($questionId);

        $this->info('Job dispatched successfully! Check the queue logs for progress.');
        $this->comment('The rubric will be saved to the options table once generated.');

        return Command::SUCCESS;
    }
}
