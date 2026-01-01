import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { AnswerOptionProps } from "../types";
import MathRenderer from "../MathRenderer";

export default function AnswerOptionsMultipleChoice({ options, showKeyAnswer = true }: AnswerOptionProps) {
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
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                                    {option.option_key}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-2">
                            <MathRenderer
                                className={cn(
                                    "text-sm",
                                    isCorrect && "font-medium text-emerald-900 dark:text-emerald-100"
                                )}
                                content={option.content}
                            />

                            {/* Media Preview */}
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
