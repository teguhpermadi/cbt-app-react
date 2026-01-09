import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, X } from 'lucide-react';

interface Props {
    studentAnswer: string[];
    keyAnswer: any; // Can be { words: string[] } or just the array depending on how it's passed
    showKeyAnswer?: boolean;
    showStudentAnswer?: boolean;
}

export default function PreviewStudentAnswerArrangeWords({
    studentAnswer = [],
    keyAnswer,
    showKeyAnswer = true,
    showStudentAnswer = true
}: Props) {
    // Normalize key answer
    // keyAnswer might be { words: [...] } from the backend structure
    const correctWords = Array.isArray(keyAnswer)
        ? keyAnswer
        : (keyAnswer?.words || []);

    const isCorrect = JSON.stringify(studentAnswer) === JSON.stringify(correctWords);

    return (
        <div className="space-y-6">
            {showStudentAnswer && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Jawaban Siswa:</span>
                        {!isCorrect && (
                            <span className="flex items-center text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
                                <X className="w-3 h-3 mr-1" />
                                Salah
                            </span>
                        )}
                        {isCorrect && (
                            <span className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400">
                                <Check className="w-3 h-3 mr-1" />
                                Benar
                            </span>
                        )}
                    </div>

                    <div className={cn(
                        "p-4 rounded-lg border flex flex-wrap gap-2",
                        isCorrect
                            ? "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800"
                            : "bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-800"
                    )}>
                        {Array.isArray(studentAnswer) && studentAnswer.length > 0 ? (
                            studentAnswer.map((word, idx) => (
                                <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="bg-background border shadow-sm"
                                >
                                    {word}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-sm text-muted-foreground italic">- Tidak menjawab -</span>
                        )}
                    </div>
                </div>
            )}

            {showKeyAnswer && !isCorrect && (
                <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Kunci Jawaban:</span>
                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 flex flex-wrap gap-2">
                        {correctWords.map((word: string, idx: number) => (
                            <Badge
                                key={idx}
                                variant="outline"
                                className="bg-white border-emerald-200 text-emerald-700 dark:bg-black/20 dark:border-emerald-700 dark:text-emerald-300"
                            >
                                {word}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
