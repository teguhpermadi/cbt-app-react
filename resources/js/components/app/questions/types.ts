export interface Option {
    id: string;
    question_id: string;
    option_key: string;
    content: string;
    media_path: string | null;
    media_url?: string | null; // Added media_url
    order: number;
    is_correct: boolean;
    metadata: any;
}

export interface Question {
    id: string;
    content: any;
    difficulty_level: string;
    timer: number;
    score_value: number;
    question_type: string;
    media_url?: string | null; // Added media_url
    options?: Option[]; // Add options relation
}

export interface AnswerOptionProps {
    options: Option[];
    showKeyAnswer?: boolean;
}

export const QUESTION_TYPE_LABELS: Record<string, string> = {
    multiple_choice: 'Pilihan Ganda',
    multiple_selection: 'Pilihan Kompleks',
    true_false: 'Benar/Salah',
    matching: 'Menjodohkan',
    ordering: 'Mengurutkan',
    numerical_input: 'Input Angka',
    essay: 'Esai/Uraian',
};
