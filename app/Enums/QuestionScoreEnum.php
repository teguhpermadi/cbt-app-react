<?php

namespace App\Enums;

enum QuestionScoreEnum: int
{
    case One = 1;
    case Two = 2;
    case Three = 3;
    case Four = 4;
    case Five = 5;

    public function getLabel(): string
    {
        return match ($this) {
            self::One => 'score 1',
            self::Two => 'score 2',
            self::Three => 'score 3',
            self::Four => 'score 4',
            self::Five => 'score 5',
        };
    }

    public function getScore(): int
    {
        return $this->value;
    }

    public function getDifficultyLabel(): string
    {
        return match ($this) {
            self::One => 'score 1',
            self::Two => 'score 2',
            self::Three => 'score 3',
            self::Four => 'score 4',
            self::Five => 'score 5',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::One => 'green',
            self::Two => 'blue',
            self::Three => 'yellow',
            self::Four => 'orange',
            self::Five => 'red',
        };
    }
}
