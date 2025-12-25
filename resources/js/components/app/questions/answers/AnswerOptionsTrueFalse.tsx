import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { AnswerOptionProps } from "../types";

export default function AnswerOptionsTrueFalse({ options, showKeyAnswer = true }: AnswerOptionProps) {
    const trueOption = options.find(o => o.option_key === 'T');
    const falseOption = options.find(o => o.option_key === 'F');

    const renderOption = (option: typeof trueOption, label: string, colorClass: string, icon: React.ReactNode) => {
        if (!option) return null;

        const isCorrect = showKeyAnswer && option.is_correct;

        return (
            <div
                key={option.id}
                className={cn(
                    "flex-1 flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all gap-3 cursor-default",
                    isCorrect
                        ? `bg-${colorClass}-50 border-${colorClass}-500 dark:bg-${colorClass}-950/30`
                        : "bg-card border-border opacity-50 grayscale"
                )}
            >
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    isCorrect ? `bg-${colorClass}-100 text-${colorClass}-600` : "bg-muted text-muted-foreground"
                )}>
                    {icon}
                </div>
                <span className={cn(
                    "font-bold text-lg",
                    isCorrect ? `text-${colorClass}-700 dark:text-${colorClass}-300` : "text-muted-foreground"
                )}>
                    {label}
                </span>
                {isCorrect && (
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-white/50 dark:bg-black/20">
                        JAWABAN BENAR
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="flex gap-4 w-full">
            {renderOption(trueOption, "BENAR", "emerald", <Check className="w-6 h-6" />)}
            {renderOption(falseOption, "SALAH", "red", <X className="w-6 h-6" />)}
        </div>
    );
}
