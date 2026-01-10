import React, { useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, X, ArrowRight } from 'lucide-react';

interface Props {
    studentAnswer: string[] | string | null;
    keyAnswer: any; // Can be { words: string[] } or just the array or a JSON string
    showKeyAnswer?: boolean;
    showStudentAnswer?: boolean;
}

export default function PreviewStudentAnswerArrangeWords({
    studentAnswer,
    keyAnswer,
    showKeyAnswer = true,
    showStudentAnswer = true
}: Props) {
    // Helper to safely parse answer data
    const parseAnswer = (data: any): string[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed)) return parsed;
                // If it parses to something else, or if it's just a string, maybe handle that?
                // For arrange words, it implies a list of words. 
                // If the string itself IS the answer (not json array), maybe split by spaces? 
                // But usually in this app context it seems to be JSON.
                // Let's assume JSON array first.
            } catch (e) {
                // If not JSON, maybe return as single items if comma separated? 
                // Or just return the string as one item?
                // Let's try to detect if it looks like a JSON array first.
            }
        }
        // Fallback for object with words property
        if (typeof data === 'object' && data.words && Array.isArray(data.words)) {
            return data.words;
        }
        return [];
    };

    const studentWords = useMemo(() => parseAnswer(studentAnswer), [studentAnswer]);
    const correctWords = useMemo(() => parseAnswer(keyAnswer), [keyAnswer]);

    // Simple array equality check
    const isCorrect = JSON.stringify(studentWords) === JSON.stringify(correctWords);

    const WordBadge = ({ word, variant = "default" }: { word: string, variant?: "default" | "success" | "destructive" | "outline" }) => {
        let styles = "text-sm px-3 py-1.5 rounded-xl shadow-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all";

        // Base styles mimicking "Duolingo" feel (rounded buttons with border-b for depth)
        if (variant === "success") {
            styles += " bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400";
        } else if (variant === "destructive") {
            styles += " bg-red-500 border-red-700 text-white hover:bg-red-400";
        } else if (variant === "outline") {
            styles += " bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200";
        } else {
            styles += " bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200";
        }

        return (
            <div className={styles}>
                {word}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {showStudentAnswer && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Jawaban Siswa:</span>
                        <div className="flex items-center gap-2">
                            {studentWords.length > 0 ? (
                                isCorrect ? (
                                    <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                                        <Check className="w-3.5 h-3.5 mr-1.5" />
                                        Benar
                                    </span>
                                ) : (
                                    <span className="flex items-center text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-md">
                                        <X className="w-3.5 h-3.5 mr-1.5" />
                                        Salah
                                    </span>
                                )
                            ) : (
                                <span className="text-xs font-medium text-muted-foreground italic">Tidak menjawab</span>
                            )}
                        </div>
                    </div>

                    <div className={cn(
                        "p-6 rounded-xl border-2 border-dashed flex flex-wrap gap-2 items-center min-h-[60px]",
                        isCorrect
                            ? "bg-emerald-50/30 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800"
                            : "bg-red-50/30 border-red-200 dark:bg-red-900/10 dark:border-red-800",
                        studentWords.length === 0 && "justify-center"
                    )}>
                        {studentWords.length > 0 ? (
                            studentWords.map((word, idx) => (
                                <WordBadge
                                    key={idx}
                                    word={word}
                                    variant={isCorrect ? "success" : "destructive"}
                                />
                            ))
                        ) : (
                            <span className="text-sm text-muted-foreground">- Kosong -</span>
                        )}
                    </div>
                </div>
            )}

            {showKeyAnswer && !isCorrect && (
                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Kunci Jawaban:</span>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/30 dark:border-slate-800 flex flex-wrap gap-2 items-center">
                        {correctWords.length > 0 ? (
                            correctWords.map((word, idx) => (
                                <WordBadge
                                    key={idx}
                                    word={word}
                                    variant="outline"
                                />
                            ))
                        ) : (
                            <span className="text-sm text-muted-foreground italic">Tidak ada kunci jawaban</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
