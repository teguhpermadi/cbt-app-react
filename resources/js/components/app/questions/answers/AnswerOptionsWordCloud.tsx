import { AnswerOptionProps } from "../types";
import { cn } from "@/lib/utils";

export default function AnswerOptionsWordCloud({ options, showKeyAnswer = true }: AnswerOptionProps) {
    // If showing key answer, we only show the CORRECT items, sorted by order.
    // If showing student submission (not handled here usually, this is for showing options/keys), 
    // we normally just show the "Correct Answer" layout.

    const correctOptions = options
        .filter(opt => opt.is_correct)
        .sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center justify-start p-4 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                {correctOptions.map((option, index) => (
                    <div
                        key={option.id || index}
                        className={cn(
                            "px-3 py-2 rounded-lg text-sm font-semibold shadow-sm",
                            showKeyAnswer
                                ? "bg-white text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50"
                                : "bg-white text-slate-700 border border-slate-200"
                        )}
                    >
                        {option.content}
                    </div>
                ))}
            </div>
            {showKeyAnswer && (
                <div className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Kunci Jawaban: Susunan kalimat yang benar
                </div>
            )}
        </div>
    );
}
