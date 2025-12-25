import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DifficultySelector } from "./DifficultySelector";
import { TimerSelector } from "./TimerSelector";
import { ScoreSelector } from "./ScoreSelector";

export interface Question {
    id: string;
    content: any; // Using any for now as content might be JSON or complex object
    difficulty_level: string;
    timer: number;
    score_value: number;
    question_type: string;
}

interface QuestionCardProps {
    question: Question;
    onUpdate?: (id: string, field: keyof Question, value: any) => void;
    readOnly?: boolean;
}

export default function QuestionCard({ question, onUpdate, readOnly = false }: QuestionCardProps) {
    const handleValueChange = (field: keyof Question, value: any) => {
        if (onUpdate && !readOnly) {
            onUpdate(question.id, field, value);
        }
    };

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
                        <div dangerouslySetInnerHTML={{ __html: question.content }} />
                    ) : (
                        <p className="text-muted-foreground italic">Content format required rendering implementation</p>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-3 bg-slate-50/20 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800 min-h-[40px]">
                {/* Footer intentionally left empty for now */}
            </CardFooter>
        </Card>
    );
}
