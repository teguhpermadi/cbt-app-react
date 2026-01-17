import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Question } from '@/components/app/questions/types';
import { Option } from '@/components/app/questions/option-editors/types';
import QuestionSuggestionController from '@/actions/App/Http/Controllers/Admin/QuestionSuggestionController';

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

        post(QuestionSuggestionController.store(question.id).url, {
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
            {/* Added p-0 gap-0 to remove default padding and use flex layout */}
            <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col gap-0 h-full">

                {/* Header Section */}
                <div className="p-6 border-b shrink-0">
                    <SheetHeader>
                        <SheetTitle>Saran Perubahan Soal</SheetTitle>
                        <SheetDescription>
                            Berikan saran perbaikan atau perubahan untuk soal ini.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                {/* Content Section - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form id="suggestion-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Reason Section */}
                        <div className="space-y-3">
                            <Label htmlFor="description" className="text-base font-medium">Alasan Perubahan <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="description"
                                placeholder="Jelaskan detail perubahan yang Anda sarankan..."
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="min-h-[200px] resize-none"
                                required
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            <p className="text-sm text-muted-foreground">
                                Masukan Anda akan dikirim ke pemilik bank soal untuk ditinjau.
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer Section */}
                <div className="p-6 border-t bg-background shrink-0 mt-auto">
                    <SheetFooter className="flex-row gap-3 sm:justify-end w-full">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
                            Batal
                        </Button>
                        <Button type="submit" form="suggestion-form" disabled={processing} className="flex-1 sm:flex-none">
                            {processing ? 'Mengirim...' : 'Kirim Saran'}
                        </Button>
                    </SheetFooter>
                </div>

            </SheetContent>
        </Sheet>
    );
}
