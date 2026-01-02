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
    // Always use the key answer for the display order, fallback to keys if not present
    const displayOrder = keyAnswer?.order && Array.isArray(keyAnswer.order)
        ? keyAnswer.order
        : Object.keys(options);

    return (
        <div className="flex flex-col gap-2">
            {displayOrder.map((key, correctIndex) => {
                const option = options[key];
                if (!option) return null;

                // Find where the student placed this item
                const studentIndex = studentAnswer?.indexOf(key) ?? -1;
                // Student's 1-based position
                const studentPosition = studentIndex !== -1 ? studentIndex + 1 : null;
                const correctPosition = correctIndex + 1;

                const isCorrectPosition = studentPosition === correctPosition;

                // Styling
                let borderColor = "border-border";
                let bgColor = "bg-card";

                // Badge Logic
                let badge = null;

                if (showStudentAnswer && studentPosition !== null) {
                    // We are showing student answer context
                    if (isCorrectPosition) {
                        borderColor = "border-emerald-200 dark:border-emerald-800";
                        bgColor = "bg-emerald-50 dark:bg-emerald-950/30";
                        badge = (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 flex items-center justify-center text-xs font-bold border border-emerald-200 dark:border-emerald-800 shadow-sm z-10">
                                {studentPosition}
                            </div>
                        );
                    } else {
                        borderColor = "border-red-200 dark:border-red-800";
                        bgColor = "bg-red-50 dark:bg-red-950/30";
                        badge = (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 flex items-center justify-center text-xs font-bold border border-red-200 dark:border-red-800 shadow-sm z-10">
                                {studentPosition}
                            </div>
                        );
                    }
                }
                // typically if we are just showing key answer (showStudentAnswer = false), we just show the list in order.
                // The list IS in order (Correct Order).
                // So we can also show a neutral index or just the item.

                return (
                    <div
                        key={`${key}-${correctIndex}`}
                        className={cn(
                            "relative flex items-center gap-3 p-3 rounded-lg border transition-all",
                            bgColor,
                            borderColor
                        )}
                    >
                        {/* Correct Order Index (The natural order of this list) */}
                        <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0 bg-muted text-muted-foreground",
                            // If it's a key answer view (no student answer), maybe highlight it nicely?
                            // But usually just 1, 2, 3...
                        )}>
                            {correctPosition}
                        </div>

                        <div className="flex-1 min-w-0 pr-8">
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

                        {badge}
                    </div>
                );
            })}
        </div>
    );
}
