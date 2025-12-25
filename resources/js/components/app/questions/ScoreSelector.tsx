import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";

interface ScoreSelectorProps {
    value: number;
    onValueChange: (value: number) => void;
    disabled?: boolean;
}

const scoreOptions = [
    { value: 1, label: 'Score 1' },
    { value: 2, label: 'Score 2' },
    { value: 3, label: 'Score 3' },
    { value: 4, label: 'Score 4' },
    { value: 5, label: 'Score 5' },
];

export function ScoreSelector({ value, onValueChange, disabled }: ScoreSelectorProps) {
    return (
        <Select
            value={value.toString()}
            onValueChange={(val) => onValueChange(parseInt(val))}
            disabled={disabled}
        >
            <SelectTrigger className="w-[120px] h-8 text-xs font-medium bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                    <Star className="size-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Score" />
                </div>
            </SelectTrigger>
            <SelectContent>
                {scoreOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()} className="text-xs">
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
