<?php

namespace App\States\QuestionSuggestion;

class Approved extends SuggestionState
{
    public static $name = 'approved';

    public function color(): string
    {
        return 'success';
    }
}
