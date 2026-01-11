<?php

namespace App\Console\Commands;

use App\Enums\DifficultyLevelEnum;
use App\Enums\QuestionTypeEnum;
use App\Jobs\GenerateQuestionsWithAI;
use Illuminate\Console\Command;
use function Laravel\Prompts\text;
use function Laravel\Prompts\textarea;

class MakeQuestionsWithAI extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:questions-ai';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate exam questions using AI based on user input';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Welcome to AI Question Generator!');

        $questionBankId = text(
            label: 'Please enter the Question Bank ID:',
            required: true,
            placeholder: 'E.g. 01jj...'
        );

        // 1. Question Type Selection using Numbered Choice
        $types = QuestionTypeEnum::cases();
        $typeOptions = [];
        foreach ($types as $index => $type) {
            $typeOptions[$index + 1] = $type->getLabel();
        }

        $selectedTypeLabel = $this->choice(
            'What type of questions do you want to create?',
            $typeOptions,
            1 // Default to first option
        );

        // Find the Enum value corresponding to the selected label
        // Since choice returns the value (Label), we need to find the key or original enum
        $selectedTypeKey = null;
        foreach ($types as $type) {
            if ($type->getLabel() === $selectedTypeLabel) {
                $selectedTypeKey = $type->value;
                break;
            }
        }

        $topic = textarea(
            label: 'Describe the topic or details for the questions:',
            placeholder: 'E.g. Sejarah Kemerdekaan Indonesia, fokus pada Budi Utomo...',
            required: true
        );

        $count = text(
            label: 'How many questions?',
            default: '5',
            validate: fn(string $value) => is_numeric($value) && $value > 0 ? null : 'Please enter a valid number.'
        );

        // 2. Difficulty Selection using Numbered Choice
        $difficulties = DifficultyLevelEnum::cases();
        $difficultyOptions = [];
        foreach ($difficulties as $index => $diff) {
            $difficultyOptions[$index + 1] = $diff->getLabel();
        }

        $selectedDiffLabel = $this->choice(
            'Select difficulty level:',
            $difficultyOptions,
            2 // Default to 'Sedang' (usually the 2nd option if Easy is 1st)
        );

        $selectedDifficulty = null;
        foreach ($difficulties as $diff) {
            if ($diff->getLabel() === $selectedDiffLabel) {
                $selectedDifficulty = $diff->value;
                break;
            }
        }

        $this->info("Dispatching job to create $count questions of type '$selectedTypeKey'...");

        GenerateQuestionsWithAI::dispatch(
            $questionBankId,
            $selectedTypeKey,
            $topic,
            (int) $count,
            $selectedDifficulty
        );

        $this->info('Job dispatched successfully! Check the queues/logs for progress.');
    }
}
