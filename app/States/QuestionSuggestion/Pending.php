<?php

namespace App\States\QuestionSuggestion;

class Pending extends SuggestionState
{
    public static $name = 'pending';

    public function color(): string
    {
        return 'warning';
    }
}
