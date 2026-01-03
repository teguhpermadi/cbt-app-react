import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";
import { MathField } from "@/components/ui/math-field";

interface PreviewStudentAnswerNumericalInputProps {
    studentAnswer?: string | null;
    keyAnswer?: { answer: string } | null;
    showStudentAnswer?: boolean;
    showKeyAnswer?: boolean;
}

export default function PreviewStudentAnswerNumericalInput({
    studentAnswer,
    keyAnswer,
    showStudentAnswer = true,
    showKeyAnswer = true
}: PreviewStudentAnswerNumericalInputProps) {
    // Only use the key answer if showKeyAnswer is true
    const correctAnswer = showKeyAnswer ? keyAnswer?.answer : null;

    // Check if student answer is correct
    const isCorrect = showStudentAnswer && studentAnswer && correctAnswer && studentAnswer === correctAnswer;
    const isIncorrect = showStudentAnswer && studentAnswer && correctAnswer && studentAnswer !== correctAnswer;

    return (
        <div className="space-y-4">
            {/* Student Answer Section */}
            {showStudentAnswer && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Student Answer</h4>
                        {isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                        {isIncorrect && (
                            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                    </div>
                    <div
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-xl border transition-all",
                            isCorrect && "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30",
                            isIncorrect && "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30",
                            !isCorrect && !isIncorrect && "border-border bg-card"
                        )}
                    >
                        <MathField
                            value={studentAnswer || ""}
                            readOnly={true}
                            className={cn(
                                "flex-1",
                                isCorrect && "bg-emerald-50 dark:bg-emerald-950/30",
                                isIncorrect && "bg-red-50 dark:bg-red-950/30"
                            )}
                            options={{
                                readOnly: true
                            }}
                        />
                        {isCorrect && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                Correct
                            </span>
                        )}
                        {isIncorrect && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                                Incorrect
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Key Answer Section */}
            {showKeyAnswer && correctAnswer && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Correct Answer</h4>
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 transition-all">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <MathField
                            value={correctAnswer}
                            readOnly={true}
                            className="flex-1 bg-emerald-50 dark:bg-emerald-950/30"
                            options={{
                                readOnly: true
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Empty state when no answers */}
            {!showStudentAnswer && !showKeyAnswer && (
                <div className="text-sm text-muted-foreground">
                    No answers to display
                </div>
            )}
        </div>
    );
}
