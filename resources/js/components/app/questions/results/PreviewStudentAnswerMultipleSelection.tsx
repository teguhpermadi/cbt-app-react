import React from "react";
import { cn } from "@/lib/utils";
import { CheckSquare, Square, XSquare } from "lucide-react";
import MathRenderer from "../MathRenderer";

interface Option {
    id: string;
    key: string;
    content: string;
    media_url?: string | null;
    media?: string | null;
}

interface PreviewStudentAnswerMultipleSelectionProps {
    options: Record<string, Option>;
    studentAnswer?: string[] | null;
    keyAnswer?: { answer?: string[], answers?: string[] } | null;
    showMedia?: boolean;
    showStudentAnswer?: boolean;
    showKeyAnswer?: boolean;
}

export default function PreviewStudentAnswerMultipleSelection({
    options,
    studentAnswer,
    keyAnswer,
    showMedia = true,
    showStudentAnswer = true,
    showKeyAnswer = true
}: PreviewStudentAnswerMultipleSelectionProps) {
    // Ensure keyAnswer.answer or keyAnswer.answers is an array
    const correctKeys = showKeyAnswer && keyAnswer ? (keyAnswer.answers || keyAnswer.answer || []) : [];

    // Ensure studentAnswer is an array
    const studentSelectedKeys = studentAnswer || [];

    return (
        <div className="grid gap-3">
            {Object.entries(options).map(([key, option]) => {
                const isSelectedByStudent = showStudentAnswer && studentSelectedKeys.includes(key);
                const isCorrectKey = correctKeys.includes(key);

                const isCorrectAndSelected = isSelectedByStudent && isCorrectKey;
                const isIncorrectAndSelected = isSelectedByStudent && !isCorrectKey;

                // Determine styling
                let borderColor = "border-border";
                let bgColor = "bg-card";

                // Icon default state
                let icon = <Square className="w-5 h-5 text-muted-foreground/30" />;

                if (isCorrectKey) {
                    borderColor = "border-emerald-200 dark:border-emerald-800";
                    bgColor = "bg-emerald-50 dark:bg-emerald-950/30";
                    icon = <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
                }

                if (isIncorrectAndSelected) {
                    borderColor = "border-red-200 dark:border-red-800";
                    bgColor = "bg-red-50 dark:bg-red-950/30";
                    icon = <XSquare className="w-5 h-5 text-red-600 dark:text-red-400" />;
                }

                return (
                    <div
                        key={key}
                        className={cn(
                            "flex items-start gap-3 p-4 rounded-xl border transition-all",
                            bgColor,
                            borderColor,
                            // Add a ring if selected by student, to distinguish their choice even if correct
                            isSelectedByStudent && "ring-2 ring-offset-2 ring-primary/20"
                        )}
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {icon}
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={cn(
                                    "text-xs font-semibold px-2 py-0.5 rounded",
                                    isCorrectKey
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                                    isIncorrectAndSelected && "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                )}>
                                    {key}
                                </span>
                            </div>

                            <MathRenderer
                                className={cn(
                                    "text-sm",
                                    isCorrectKey && "font-medium text-emerald-900 dark:text-emerald-100",
                                    isIncorrectAndSelected && "text-red-900 dark:text-red-100"
                                )}
                                content={option.content}
                            />

                            {/* Media Preview */}
                            {showMedia && (option.media_url || option.media) && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-border max-w-xs">
                                    <img
                                        src={option.media_url || option.media || ''}
                                        alt={`Option ${key}`}
                                        className="max-h-[100px] max-w-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Labels for clarity */}
                            <div className="flex flex-wrap gap-2">
                                {isSelectedByStudent && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                        Student Answer
                                    </span>
                                )}
                                {isCorrectKey && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                        Correct Answer
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
