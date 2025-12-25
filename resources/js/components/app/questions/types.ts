export interface Option {
    id: string;
    question_id: string;
    option_key: string;
    content: string;
    media_path: string | null;
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
    options?: Option[]; // Add options relation
}

export interface AnswerOptionProps {
    options: Option[];
    showKeyAnswer?: boolean;
}
