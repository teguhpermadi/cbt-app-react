<?php

namespace App\Enums;

enum ExamStatusEnum: string
{
    case Scheduled = 'scheduled';
    case Ongoing = 'ongoing';
    case Finished = 'finished';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Scheduled => 'Dijadwalkan',
            self::Ongoing => 'Sedang Dilakukan',
            self::Finished => 'Sudah Lewat',
        };
    }

    public function getColor(): string | array | null
    {
        return match ($this) {
            self::Scheduled => 'warning',
            self::Ongoing => 'success',
            self::Finished => 'gray',
        };
    }
}
