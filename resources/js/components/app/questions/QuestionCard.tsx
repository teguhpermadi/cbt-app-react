import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Tag, X, BookOpen } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { DifficultySelector } from "./DifficultySelector";
import { TimerSelector } from "./TimerSelector";
import { ScoreSelector } from "./ScoreSelector";
import { TagAutocomplete } from "./TagAutocomplete";
import RichTextEditor from "@/components/ui/rich-text/RichTextEditor";

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

    const hasReadingMaterial = !!question.reading_material;

    return (
        <Card className={`overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl transition-all hover:shadow-md ${hasReadingMaterial ? 'border-l-4 border-l-blue-500' : ''}`}>
            <CardHeader className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
                                {QUESTION_TYPE_LABELS[question.question_type] ?? question.question_type}
                            </Badge>

                            {hasReadingMaterial && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                        >
                                            <BookOpen className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">Lihat Bacaan</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>{question.reading_material?.title}</DialogTitle>
                                            <div className="sr-only">
                                                <DialogDescription>
                                                    Reading material content for {question.reading_material?.title}
                                                </DialogDescription>
                                            </div>
                                        </DialogHeader>
                                        <div className="mt-4 space-y-4">
                                            {/* PDF Viewer */}
                                            {question.reading_material?.media_type === 'application/pdf' && question.reading_material.media_url && (
                                                <div className="w-full h-[500px] border rounded-md overflow-hidden">
                                                    <iframe
                                                        src={`${question.reading_material.media_url}#toolbar=0`}
                                                        className="w-full h-full"
                                                        title={question.reading_material.title}
                                                    />
                                                </div>
                                            )}

                                            {/* Other Media Types (e.g., Image) */}
                                            {question.reading_material?.media_type?.startsWith('image/') && question.reading_material.media_url && (
                                                <div className="w-full rounded-md overflow-hidden">
                                                    <img
                                                        src={question.reading_material.media_url}
                                                        alt={question.reading_material.title}
                                                        className="w-full object-contain"
                                                    />
                                                </div>
                                            )}

                                            {question.reading_material?.content && (
                                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                                    <RichTextEditor
                                                        value={question.reading_material.content}
                                                        readOnly={true}
                                                        className="bg-transparent border-none p-0"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">

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
                    {/* Render content using RichTextEditor in readOnly mode */}
                    <RichTextEditor
                        value={typeof question.content === 'string' ? question.content : ''}
                        readOnly={true}
                        className="bg-transparent border-none p-0"
                    />
                </div>
            </CardContent>
            <CardFooter className="p-3 bg-slate-50/20 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800 flex-col items-start gap-4">
                <div className="w-full">
                    <AnswerOptions question={question} showKeyAnswer={showKeyAnswer} />
                </div>

                <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {question.tags?.map((tag, index) => {
                            // Handle Spatie Translatable Tag
                            const tagName = typeof tag.name === 'object'
                                ? (tag.name['en'] || tag.name['id'] || Object.values(tag.name)[0])
                                : tag.name;

                            return (
                                <Badge key={index} variant="secondary" className="gap-1 pr-1">
                                    {tagName}
                                    {!readOnly && (
                                        <button
                                            onClick={() => {
                                                const currentTags = question.tags?.map(t =>
                                                    typeof t.name === 'object' ? (t.name['en'] || t.name['id'] || Object.values(t.name)[0]) : t.name
                                                ) || [];
                                                const newTags = currentTags.filter((_, i) => i !== index);
                                                handleValueChange('tags', newTags);
                                            }}
                                            className="hover:bg-red-100 hover:text-red-600 rounded-full p-0.5 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </Badge>
                            );
                        })}
                    </div>
                    {!readOnly && (
                        <div className="flex w-full max-w-xs items-center space-x-2">
                            <TagAutocomplete
                                onSelect={(val) => {
                                    if (val) {
                                        const currentTags = question.tags?.map(t =>
                                            typeof t.name === 'object' ? (t.name['en'] || t.name['id'] || Object.values(t.name)[0]) : t.name
                                        ) || [];
                                        if (!currentTags.includes(val)) {
                                            handleValueChange('tags', [...currentTags, val]);
                                        }
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            </CardFooter>
        </Card >
    );
}
