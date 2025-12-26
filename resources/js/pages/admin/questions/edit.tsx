import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Plus, Trash2, AlertCircle, Image as ImageIcon, X } from 'lucide-react'; // Added Image icon
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { DifficultySelector } from '@/components/app/questions/DifficultySelector';
import { QuestionTypeSelector } from '@/components/app/questions/QuestionTypeSelector';
import { TimerSelector } from '@/components/app/questions/TimerSelector';
import { ScoreSelector } from '@/components/app/questions/ScoreSelector';

// Icons for Question Types
import {
    AlignLeft,
    CheckSquare,
    ListOrdered,
    Type,
    GitMerge,
    Calculator
} from 'lucide-react';
import QuestionBankController from '@/actions/App/Http/Controllers/Admin/QuestionBankController';
import QuestionController from '@/actions/App/Http/Controllers/Admin/QuestionController';

declare function route(name: string, params?: any): string;

import OptionsEditor from '@/components/app/questions/option-editors/OptionsEditor';
import { Option } from '@/components/app/questions/option-editors/types';

interface Question {
    id: string;
    question_bank_id: string;
    content: string;
    question_type: string;
    difficulty_level: string;
    timer: number;
    score_value: number;
    options: Option[];
    media_url?: string | null;
}

interface EnumOption {
    value: string | number;
    name?: string;
}

interface QuestionFormData {
    _method: string;
    content: string;
    question_type: string;
    difficulty_level: string;
    timer: number;
    score_value: number;
    options: Option[];
    question_media?: File | null;
    delete_question_media?: boolean;
}

interface Props {
    question: Question;
    difficulties: EnumOption[];
    timers: EnumOption[];
    scores: EnumOption[];
}

export default function EditQuestion({ question, difficulties, timers, scores }: Props) {
    const initialData: QuestionFormData = {
        _method: 'PUT',
        content: question.content || '',
        question_type: question.question_type,
        difficulty_level: question.difficulty_level,
        timer: question.timer,
        score_value: question.score_value,
        options: question.options.map(opt => ({ ...opt, media_file: null, delete_media: false })),
        question_media: null,
        delete_question_media: false,
    };

    const { data, setData, post, processing, errors } = useForm(initialData);
    const [previewQuestionMedia, setPreviewQuestionMedia] = useState<string | null>(question.media_url || null);

    const handleTypeChange = (value: string) => {
        setData('question_type', value);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use POST with _method: PUT to support file uploads
        post(QuestionController.update(question.id).url, {
            forceFormData: true,
        });
    };

    const handleQuestionMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('question_media', file);
            setData('delete_question_media', false);
            const objectUrl = URL.createObjectURL(file);
            setPreviewQuestionMedia(objectUrl);
        }
    };

    const removeQuestionMedia = () => {
        setData('question_media', null);
        setData('delete_question_media', true);
        setPreviewQuestionMedia(null);
    };

    return (
        <div className="min-h-screen bg-muted/40 flex flex-col">
            <Head title={`Edit Soal # ${question.id}`} />

            {/* TOPBAR */}
            <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
                <Link
                    href={QuestionBankController.edit(question.question_bank_id).url}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>

                <div className="h-6 w-px bg-border mx-2" />

                <div className="flex items-center gap-2 flex-1 overflow-x-auto pb-1 md:pb-0">
                    <QuestionTypeSelector
                        value={data.question_type}
                        onValueChange={handleTypeChange}
                    />

                    <DifficultySelector
                        value={data.difficulty_level}
                        onValueChange={(v) => setData('difficulty_level', v)}
                    />

                    <TimerSelector
                        value={data.timer}
                        onValueChange={(v) => setData('timer', v)}
                    />

                    <ScoreSelector
                        value={data.score_value}
                        onValueChange={(v) => setData('score_value', v)}
                    />
                </div>

                <Button onClick={submit} disabled={processing} className="gap-2">
                    <Save className="h-4 w-4" />
                    Simpan
                </Button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-auto p-6 space-y-6 max-w-5xl mx-auto w-full">

                {/* QUESTION CARD */}
                <Card className="border-primary/10 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Konten Soal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="Tuliskan pertanyaan di sini..."
                            className="min-h-[120px] text-lg p-4 resize-y"
                        />
                        {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}

                        {/* Media Upload for Question */}
                        <div className="space-y-2">
                            <Label>Media / Gambar (Opsional)</Label>
                            <div className="flex items-start gap-4">
                                {previewQuestionMedia ? (
                                    <div className="relative group">
                                        <img src={previewQuestionMedia} alt="Preview" className="h-40 w-auto object-contain rounded-md border bg-muted" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={removeQuestionMedia}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="h-40 w-40 flex items-center justify-center rounded-md border border-dashed bg-muted/50 text-muted-foreground">
                                        <ImageIcon className="h-10 w-10 opacity-50" />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleQuestionMediaChange}
                                        className="max-w-xs"
                                    />
                                    <p className="text-xs text-muted-foreground">Format: JPG, PNG, GIF. Maks: 2MB.</p>
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* OPTIONS EDITOR */}
                <OptionsEditor
                    type={data.question_type}
                    options={data.options}
                    onChange={(newOptions) => setData('options', newOptions)}
                    errors={errors} // Pass errors to show option specific errors if needed
                />

            </div>
        </div>
    );
}



