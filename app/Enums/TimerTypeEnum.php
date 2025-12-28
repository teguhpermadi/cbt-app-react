<?php

namespace App\Enums;

enum TimerTypeEnum: string
{
    case Strict = 'strict';
    case Flexible = 'flexible';

    /**
     * Mendapatkan label yang lebih mudah dibaca untuk UI
     */
    public function getLabel(): string
    {
        return match ($this) {
            self::Strict => 'Ketat',
            self::Flexible => 'Longgar',
        };
    }

    /**
     * Mendapatkan deskripsi untuk setiap jenis timer
     */
    public function getDescription(): string
    {
        return match ($this) {
            self::Strict => 'Timer berjalan terus meskipun siswa keluar dari ujian',
            self::Flexible => 'Timer berhenti saat siswa keluar dari ujian',
        };
    }
}
