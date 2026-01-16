import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '@/components/ui/rich-text/RichTextEditor';
import { DifficultySelector } from '@/components/app/questions/DifficultySelector';
import { QuestionTypeSelector } from '@/components/app/questions/QuestionTypeSelector';
import { TimerSelector } from '@/components/app/questions/TimerSelector';
import { ScoreSelector } from '@/components/app/questions/ScoreSelector';
import OptionsEditor from '@/components/app/questions/option-editors/OptionsEditor';
import { Question } from '@/components/app/questions/types';
import { Option } from '@/components/app/questions/option-editors/types';
import QuestionSuggestionController from '@/actions/App/Http/Controllers/Admin/QuestionSuggestionController';

// Add Ziggy route helper declaration
declare function route(name: string, params?: any): string;

interface QuestionSuggestionSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    question: Question;
}

export default function QuestionSuggestionSidebar({
    open,
    onOpenChange,
    question
}: QuestionSuggestionSidebarProps) {

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        description: '',
        content: question.content || '',
        question_type: question.question_type,
        difficulty_level: question.difficulty_level,
        timer: question.timer,
        score_value: question.score_value,
        options: question.options as Option[],
        hint: question.hint || '',
    });

    useEffect(() => {
        if (open) {
            setData({
                description: '',
                content: question.content || '',
                question_type: question.question_type,
                difficulty_level: question.difficulty_level,
                timer: question.timer,
                score_value: question.score_value,
                options: JSON.parse(JSON.stringify(question.options)),
                hint: question.hint || '',
            });
        }
    }, [open, question]);

    useEffect(() => {
        if (wasSuccessful) {
            onOpenChange(false);
            reset();
        }
    }, [wasSuccessful]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route(QuestionSuggestionController.store(question.id).url), {
            transform: (data) => ({
                description: data.description,
                data: {
                    content: data.content,
                    question_type: data.question_type,
                    difficulty_level: data.difficulty_level,
                    timer: data.timer,
                    score_value: data.score_value,
                    options: data.options,
                    hint: data.hint,
                }
            }),
            preserveScroll: true,
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {/* Increased width to sm:max-w-4xl for better visibility */}
            <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>Saran Perubahan Soal</SheetTitle>
                    <SheetDescription>
                        Berikan saran perbaikan atau perubahan untuk soal ini.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-8 pb-20">

                    {/* Reason Section - Highlighted */}
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 space-y-2">
                        <Label className="text-amber-900 font-semibold">Alasan Perubahan (Wajib)</Label>
                        <Textarea
                            placeholder="Jelaskan detail perubahan yang Anda sarankan..."
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="bg-white border-amber-200 focus-visible:ring-amber-500 min-h-[80px]"
                            required
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            Detail Soal
                        </h3>

                        {/* 2-Column Grid for Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 p-4 bg-muted/30 rounded-lg">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Tipe Soal</Label>
                                <QuestionTypeSelector
                                    value={data.question_type}
                                    onValueChange={v => setData('question_type', v)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Kesulitan</Label>
                                <DifficultySelector
                                    value={data.difficulty_level}
                                    onValueChange={v => setData('difficulty_level', v)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Waktu (Detik)</Label>
                                <TimerSelector
                                    value={data.timer}
                                    onValueChange={v => setData('timer', v)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Poin</Label>
                                <ScoreSelector
                                    value={data.score_value}
                                    onValueChange={v => setData('score_value', v)}
                                />
                            </div>
                        </div>

                        {/* Content - Increased Height */}
                        <div className="space-y-3 mb-8">
                            <Label className="text-base">Pertanyaan</Label>
                            <div className="min-h-[200px] border rounded-md">
                                <RichTextEditor
                                    value={data.content}
                                    onChange={v => setData('content', v)}
                                    className="min-h-[200px]" // Force larger height
                                />
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-3 mb-8">
                            <Label className="text-base">Opsi Jawaban</Label>
                            <div className="border rounded-lg p-4 bg-background">
                                <OptionsEditor
                                    type={data.question_type}
                                    options={data.options}
                                    onChange={(newOptions) => setData('options', newOptions)}
                                />
                            </div>
                        </div>

                        {/* Hint */}
                        <div className="space-y-3">
                            <Label className="text-base">Hint / Bantuan</Label>
                            <RichTextEditor
                                value={data.hint}
                                onChange={v => setData('hint', v)}
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>

                    <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t gap-2 sm:gap-0">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="mr-auto">
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            {processing ? 'Mengirim...' : 'Kirim Saran'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
