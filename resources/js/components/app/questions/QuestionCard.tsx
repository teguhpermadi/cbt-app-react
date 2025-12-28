import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import renderMathInElement from "katex/dist/contrib/auto-render";
import { DifficultySelector } from "./DifficultySelector";
import { TimerSelector } from "./TimerSelector";
import { ScoreSelector } from "./ScoreSelector";

import AnswerOptions from "./AnswerOptions";
import { Question, QUESTION_TYPE_LABELS } from "./types";

// Removed local interface Question definition in favor of types.ts


interface QuestionCardProps {
    question: Question;
    onUpdate?: (id: string, field: keyof Question, value: any) => void;
    onEdit?: (question: Question) => void;
    onDelete?: (id: string) => void;
    readOnly?: boolean;
}

export default function QuestionCard({
    question,
    onUpdate,
    onEdit,
    onDelete,
    readOnly = false
}: QuestionCardProps) {
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
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
                            {QUESTION_TYPE_LABELS[question.question_type] ?? question.question_type}
                        </Badge>

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

                        {!readOnly && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    onClick={() => onEdit && onEdit(question)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={() => {
                                        if (onDelete) {
                                            if (window.confirm("Apakah anda yakin ingin menghapus pertanyaan ini?")) {
                                                onDelete(question.id);
                                            }
                                        }
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                    {/* Media Preview */}
                    {question.media_url && (
                        <div className="mb-4">
                            <img
                                src={question.media_url}
                                alt="Question Media"
                                className="max-h-[100px] max-w-full rounded-md object-contain border bg-slate-50 dark:bg-slate-900"
                            />
                        </div>
                    )}

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
