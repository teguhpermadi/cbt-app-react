import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";
import MathRenderer from "../MathRenderer";

interface Option {
    id: string;
    key: string;
    content: string;
    media_url?: string | null;
    media?: string | null;
}

interface PreviewStudentAnswerTrueFalseProps {
    options: Record<string, Option>;
    studentAnswer?: string | null;
    keyAnswer?: { answer: string } | null;
    showMedia?: boolean;
    showStudentAnswer?: boolean;
    showKeyAnswer?: boolean;
}

export default function PreviewStudentAnswerTrueFalse({
    options,
    studentAnswer,
    keyAnswer,
    showMedia = true,
    showStudentAnswer = true,
    showKeyAnswer = true
}: PreviewStudentAnswerTrueFalseProps) {
    // Only use the key answer if showKeyAnswer is true
    const correctKey = showKeyAnswer ? keyAnswer?.answer : null;

    // Use specific order for True/False if possible, usually T then F, but we can just map values
    // If we want to guarantee T then F, we could sort specific keys, but Object.entries usually respects insertion order or we can just map.
    // Let's just map Object.entries for flexibility.

    return (
        <div className="grid gap-3">
            {Object.entries(options).map(([key, option]) => {
                // Only consider it selected by student if showStudentAnswer is true
                const isSelectedByStudent = showStudentAnswer && (studentAnswer === key);
                const isCorrectKey = correctKey === key;
                const isIncorrectAndSelected = isSelectedByStudent && !isCorrectKey;

                // Determine styling
                let borderColor = "border-border";
                let bgColor = "bg-card";

                // Icon default state
                let icon = (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                        {key}
                    </div>
                );

                if (isCorrectKey) {
                    borderColor = "border-emerald-200 dark:border-emerald-800";
                    bgColor = "bg-emerald-50 dark:bg-emerald-950/30";
                    icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
                }

                if (isIncorrectAndSelected) {
                    borderColor = "border-red-200 dark:border-red-800";
                    bgColor = "bg-red-50 dark:bg-red-950/30";
                    icon = <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
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
