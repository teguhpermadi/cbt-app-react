import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DifficultySelectorProps {
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
}

const difficultyOptions = [
    { value: 'mudah', label: 'Mudah' },
    { value: 'sedang', label: 'Sedang' },
    { value: 'sulit', label: 'Sulit' },
];

export function DifficultySelector({ value, onValueChange, disabled }: DifficultySelectorProps) {
    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className="w-[140px] h-8 text-xs font-medium bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg">
                <SelectValue placeholder="Kesulitan" />
            </SelectTrigger>
            <SelectContent>
                {difficultyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
