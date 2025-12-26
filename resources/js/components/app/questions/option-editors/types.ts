export interface Option {
    id?: string;
    option_key: string;
    content: string;
    is_correct: boolean;
    order: number;
    metadata?: any;
    media_url?: string | null;
    media_file?: File | null;
    delete_media?: boolean;
}

export interface OptionEditorProps {
    options: Option[];
    onChange: (options: Option[]) => void;
    errors?: any;
}
