import React from "react";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/ui/rich-text/RichTextEditor";

interface PreviewStudentAnswerEssayProps {
    studentAnswer?: string | null;
    keyAnswer?: string | null;
    showStudentAnswer?: boolean;
    showKeyAnswer?: boolean;
}

export default function PreviewStudentAnswerEssay({
    studentAnswer,
    keyAnswer,
    showStudentAnswer = true,
    showKeyAnswer = true
}: PreviewStudentAnswerEssayProps) {
    return (
        <div className="space-y-4">
            {/* Student Answer Section */}
            {showStudentAnswer && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Student Answer</h4>
                    <div
                        className={cn(
                            "p-4 rounded-xl border transition-all",
                            "border-border bg-card"
                        )}
                    >
                        {studentAnswer ? (
                            <RichTextEditor
                                value={studentAnswer}
                                readOnly={true}
                                className="border-none"
                            />
                        ) : (
                            <div className="text-sm text-muted-foreground italic">
                                No answer provided
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Key Answer Section */}
            {showKeyAnswer && keyAnswer && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Model Answer / Rubric</h4>
                    <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 transition-all">
                        <RichTextEditor
                            value={keyAnswer}
                            readOnly={true}
                            className="border-none bg-transparent"
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
