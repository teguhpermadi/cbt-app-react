import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface QuestionTypeSelectorProps {
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
}

const questionTypeOptions = [
    { value: 'multiple_choice', label: 'Pilihan Ganda (Tunggal)' },
    { value: 'multiple_selection', label: 'Pilihan Ganda Kompleks' },
    { value: 'true_false', label: 'Benar/Salah' },
    { value: 'matching', label: 'Menjodohkan' },
    { value: 'ordering', label: 'Mengurutkan' },
    { value: 'essay', label: 'Esai/Uraian' },
    { value: 'numerical_input', label: 'Input Angka' },
    { value: 'word_cloud', label: 'Awan Kata' },
];

export function QuestionTypeSelector({ value, onValueChange, disabled }: QuestionTypeSelectorProps) {
    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className="w-[180px] h-8 text-xs font-medium bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg">
                <SelectValue placeholder="Tipe Soal" />
            </SelectTrigger>
            <SelectContent>
                {questionTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
