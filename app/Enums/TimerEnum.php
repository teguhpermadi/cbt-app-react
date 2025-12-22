<?php

namespace App\Enums;

enum TimerEnum: int
{
    case ThirtySeconds = 30;
    case FortyFiveSeconds = 45;
    case OneMinute = 60;
    case OneAndHalfMinutes = 90;
    case ThreeMinutes = 180;
    case FiveMinutes = 300;
    case TenMinutes = 600;

    /**
     * Mendapatkan label yang lebih mudah dibaca untuk UI
     */
    public function getLabel(): string
    {
        return match ($this) {
            self::ThirtySeconds => '30 detik',
            self::FortyFiveSeconds => '45 detik',
            self::OneMinute => '1 menit',
            self::OneAndHalfMinutes => '1,5 menit',
            self::ThreeMinutes => '3 menit',
            self::FiveMinutes => '5 menit',
            self::TenMinutes => '10 menit',
        };
    }

    /**
     * Mendapatkan nilai timer dalam detik
     */
    public function getSeconds(): int
    {
        return $this->value;
    }

    /**
     * Mendapatkan nilai timer dalam format yang human-readable
     */
    public function getFormattedTime(): string
    {
        return $this->getLabel();
    }
}
