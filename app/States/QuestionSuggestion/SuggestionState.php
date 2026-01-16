<?php

namespace App\States\QuestionSuggestion;

use Spatie\ModelStates\State;
use Spatie\ModelStates\StateConfig;

abstract class SuggestionState extends State
{
    abstract public function color(): string;

    public static function config(): StateConfig
    {
        return parent::config()
            ->default(Pending::class)
            ->allowTransition(Pending::class, Approved::class)
            ->allowTransition(Pending::class, Rejected::class);
    }
}
