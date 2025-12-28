import { cn } from "@/lib/utils";
import { CheckSquare, Square } from "lucide-react";
import { AnswerOptionProps } from "../types";

export default function AnswerOptionsMultipleSelection({ options, showKeyAnswer = true }: AnswerOptionProps) {
    return (
        <div className="grid gap-3">
            {options.map((option) => {
                const isCorrect = showKeyAnswer && option.is_correct;

                return (
                    <div
                        key={option.id}
                        className={cn(
                            "flex items-start gap-3 p-4 rounded-xl border transition-all",
                            isCorrect
                                ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800"
                                : "bg-card border-border hover:border-primary/50"
                        )}
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {isCorrect ? (
                                <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                                <Square className="w-5 h-5 text-muted-foreground/30" />
                            )}
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    {option.option_key}
                                </span>
                            </div>

                            <div
                                className={cn(
                                    "text-sm",
                                    isCorrect && "font-medium text-emerald-900 dark:text-emerald-100"
                                )}
                                dangerouslySetInnerHTML={{ __html: option.content }}
                            />

                            {/* Media (URL or Path) */}
                            {(option.media_url || option.media_path) && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-border max-w-xs">
                                    <img
                                        src={option.media_url || option.media_path || ''}
                                        alt={`Option ${option.option_key}`}
                                        className="max-h-[100px] max-w-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
