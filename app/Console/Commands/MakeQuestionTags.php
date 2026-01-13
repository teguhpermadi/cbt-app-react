<?php

namespace App\Console\Commands;

use App\Jobs\GenerateQuestionTags;
use App\Models\QuestionBank;
use Illuminate\Console\Command;

class MakeQuestionTags extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'questions:generate-tags {question_bank_id : The ID of the question bank}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate AI-powered tags for all questions in a question bank';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $questionBankId = $this->argument('question_bank_id');

        // Validate question bank exists
        $questionBank = QuestionBank::find($questionBankId);

        if (!$questionBank) {
            $this->error("Question Bank with ID {$questionBankId} not found.");
            return 1;
        }

        $this->info("Generating tags for Question Bank: {$questionBank->name}");
        $this->info("This may take a few minutes...");

        // Dispatch the job
        GenerateQuestionTags::dispatch($questionBankId);

        $this->info("Tag generation job has been dispatched!");
        $this->info("Tags will be generated in the background.");
        $this->comment("You can check the logs for progress: storage/logs/laravel.log");

        return 0;
    }
}
