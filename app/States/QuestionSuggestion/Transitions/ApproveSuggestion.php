<?php

namespace App\States\QuestionSuggestion\Transitions;

use App\Models\QuestionSuggestion;
use App\States\QuestionSuggestion\Approved;
use Spatie\ModelStates\Transition;

class ApproveSuggestion extends Transition
{
    public function __construct(protected QuestionSuggestion $suggestion) {}

    public function handle(): QuestionSuggestion
    {
        $question = $this->suggestion->question;
        $data = $this->suggestion->data;

        // 1. Update question with suggestion data
        // Assuming 'data' contains fields like 'content', 'options' etc.
        $question->fill($data);

        // 2. Save the question (Versionable trait handles snapshotting automatically on update)
        $question->save();

        // 3. Mark suggestion as approved
        $this->suggestion->state = new Approved($this->suggestion);
        $this->suggestion->save();

        return $this->suggestion;
    }
}
