import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import renderMathInElement from "katex/dist/contrib/auto-render";
import { DifficultySelector } from "./DifficultySelector";
import { TimerSelector } from "./TimerSelector";
import { ScoreSelector } from "./ScoreSelector";

import AnswerOptions from "./AnswerOptions";
import { Question } from "./types";

// Removed local interface Question definition in favor of types.ts


interface QuestionCardProps {
    question: Question;
    onUpdate?: (id: string, field: keyof Question, value: any) => void;
    readOnly?: boolean;
}

export default function QuestionCard({ question, onUpdate, readOnly = false }: QuestionCardProps) {
    // Default to readOnly for now, so we show key answer always when viewing.
    // In edit mode (readOnly=false), we also want to see the key answer to know what's correct.
    const showKeyAnswer = true;

    const handleValueChange = (field: keyof Question, value: any) => {
        if (onUpdate && !readOnly) {
            onUpdate(question.id, field, value);
        }
    };

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current && typeof question.content === 'string') {
            renderMathInElement(contentRef.current, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        }
    }, [question.content]);

    return (
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl transition-all hover:shadow-md">
            <CardHeader className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                    <DifficultySelector
                        value={question.difficulty_level}
                        onValueChange={(val) => handleValueChange('difficulty_level', val)}
                        disabled={readOnly}
                    />

                    <TimerSelector
                        value={question.timer}
                        onValueChange={(val) => handleValueChange('timer', val)}
                        disabled={readOnly}
                    />

                    <ScoreSelector
                        value={question.score_value}
                        onValueChange={(val) => handleValueChange('score_value', val)}
                        disabled={readOnly}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                    {/* Render content based on type later, for now just dump or show text */}
                    {typeof question.content === 'string' ? (
                        <div ref={contentRef} dangerouslySetInnerHTML={{ __html: question.content }} />
                    ) : (
                        <p className="text-muted-foreground italic">Content format required rendering implementation</p>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-3 bg-slate-50/20 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800 flex-col items-start gap-4">
                <div className="w-full">
                    <AnswerOptions question={question} showKeyAnswer={showKeyAnswer} />
                </div>
            </CardFooter>
        </Card>
    );
}
