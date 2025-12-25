import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";

interface TimerSelectorProps {
    value: number;
    onValueChange: (value: number) => void;
    disabled?: boolean;
}

const timerOptions = [
    { value: 30, label: '30 detik' },
    { value: 45, label: '45 detik' },
    { value: 60, label: '1 menit' },
    { value: 90, label: '1,5 menit' },
    { value: 180, label: '3 menit' },
    { value: 300, label: '5 menit' },
    { value: 600, label: '10 menit' },
];

export function TimerSelector({ value, onValueChange, disabled }: TimerSelectorProps) {
    return (
        <Select
            value={value.toString()}
            onValueChange={(val) => onValueChange(parseInt(val))}
            disabled={disabled}
        >
            <SelectTrigger className="w-[130px] h-8 text-xs font-medium bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Waktu" />
                </div>
            </SelectTrigger>
            <SelectContent>
                {timerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()} className="text-xs">
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
