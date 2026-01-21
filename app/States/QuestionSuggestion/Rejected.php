<?php

namespace App\States\QuestionSuggestion;

class Rejected extends SuggestionState
{
    public static $name = 'rejected';

    public function color(): string
    {
        return 'danger';
    }
}
