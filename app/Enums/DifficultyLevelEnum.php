<?php

namespace App\Enums;

enum DifficultyLevelEnum: string {
    case Easy = 'mudah';
    case Medium = 'sedang';
    case Hard = 'sulit';

    public function getLabel(): string
    {
        return match ($this) {
            self::Easy => 'Mudah',
            self::Medium => 'Sedang',
            self::Hard => 'Sulit',
        };
    }
}