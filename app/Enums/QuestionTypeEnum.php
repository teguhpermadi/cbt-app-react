<?php

namespace App\Enums;

enum QuestionTypeEnum: string
{
    // 1. Pilihan Tunggal (Jawaban Benar Hanya Satu)
    case MultipleChoice = 'multiple_choice';

        // 2. Benar/Salah
    case TrueFalse = 'true_false';

        // 3. Uraian (Koreksi Manual/Rubrik AI)
    case Essay = 'essay';

        // 4. Menjodohkan
    case Matching = 'matching';

        // 5. Mengurutkan
    case Ordering = 'ordering';

        // 6. Pilihan Kompleks (Jawaban Benar Lebih Dari Satu)
    case MultipleSelection = 'multiple_selection';

        // 7. Input Angka (Jawaban Angka Tepat)
    case NumericalInput = 'numerical_input';

        // 8. Word Cloud (Jawaban Kata Kunci)
    case WordCloud = 'word_cloud';


    /**
     * Helper: Mendapatkan label yang lebih mudah dibaca untuk UI
     */
    public function getLabel(): string
    {
        return match ($this) {
            self::MultipleChoice => 'Pilihan Ganda (Tunggal)',
            self::TrueFalse => 'Benar/Salah',
            self::Essay => 'Esai/Uraian',
            self::Matching => 'Menjodohkan',
            self::Ordering => 'Mengurutkan',
            self::MultipleSelection => 'Pilihan Ganda Kompleks',
            self::NumericalInput => 'Input Angka',
            self::WordCloud => 'Word Cloud',
        };
    }
}
