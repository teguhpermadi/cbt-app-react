import React from "react";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import MathRenderer from "../MathRenderer";

interface Option {
    id: string;
    key: string;
    content: string;
    media_url?: string | null;
    media?: string | null;
}

interface PreviewStudentAnswerOrderingProps {
    options: Record<string, Option>;
    studentAnswer?: string[] | null;
    keyAnswer?: { order: string[] } | null;
    showMedia?: boolean;
    showStudentAnswer?: boolean;
    showKeyAnswer?: boolean;
}

export default function PreviewStudentAnswerOrdering({
    options,
    studentAnswer,
    keyAnswer,
    showMedia = true,
    showStudentAnswer = true,
    showKeyAnswer = true
}: PreviewStudentAnswerOrderingProps) {
    // Determine the order to display
    // If showing student answer, determine based on student's array
    // If showing key answer (and not student), determine based on key's array

    let displayOrder: string[] = [];

    if (showStudentAnswer && studentAnswer && Array.isArray(studentAnswer)) {
        displayOrder = studentAnswer;
    } else if (showKeyAnswer && keyAnswer?.order && Array.isArray(keyAnswer.order)) {
        displayOrder = keyAnswer.order;
    } else {
        // Fallback: just show keys as they are in options
        displayOrder = Object.keys(options);
    }

    // Determine correctness for coloring if showing student answer
    const correctOrder = keyAnswer?.order || [];

    return (
        <div className="flex flex-col gap-2">
            {displayOrder.map((key, index) => {
                const option = options[key];
                if (!option) return null;

                // Check if this specific position matches the correct order's position
                // Only relevant if we are showing student answer and we have a key to compare against
                const isCorrectPosition = showStudentAnswer && correctOrder[index] === key;
                const isKeyMode = showKeyAnswer && !showStudentAnswer;

                let borderColor = "border-border";
                let bgColor = "bg-card";
                let indexColor = "bg-muted text-muted-foreground";

                if (showStudentAnswer) {
                    if (isCorrectPosition) {
                        borderColor = "border-emerald-200 dark:border-emerald-800 pointer-events-none";
                        bgColor = "bg-emerald-50 dark:bg-emerald-950/30";
                        indexColor = "bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
                    } else {
                        // If wrong position
                        borderColor = "border-red-200 dark:border-red-800";
                        bgColor = "bg-red-50 dark:bg-red-950/30";
                        indexColor = "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200";
                    }
                } else if (isKeyMode) {
                    // Key answer view, just show neutral or correct style
                    borderColor = "border-emerald-200 dark:border-emerald-800";
                    bgColor = "bg-emerald-50 dark:bg-emerald-950/30";
                    indexColor = "bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
                }

                return (
                    <div
                        key={`${key}-${index}`}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border transition-all",
                            bgColor,
                            borderColor
                        )}
                    >
                        <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0",
                            indexColor
                        )}>
                            {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                            <MathRenderer
                                className="text-sm"
                                content={option.content}
                            />

                            {/* Media Preview */}
                            {showMedia && (option.media_url || option.media) && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-border max-w-xs">
                                    <img
                                        src={option.media_url || option.media || ''}
                                        alt={`Option ${key}`}
                                        className="max-h-[80px] w-auto object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Drag Handle Icon Visual (static) */}
                        <div className="text-muted-foreground/30">
                            <GripVertical className="w-5 h-5" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
