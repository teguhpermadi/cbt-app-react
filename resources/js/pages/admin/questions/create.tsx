import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '@/components/ui/rich-text/RichTextEditor';
import { ArrowLeft, Save, AlertCircle, Image as ImageIcon, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DifficultySelector } from '@/components/app/questions/DifficultySelector';
import { QuestionTypeSelector } from '@/components/app/questions/QuestionTypeSelector';
import { TimerSelector } from '@/components/app/questions/TimerSelector';
import { ScoreSelector } from '@/components/app/questions/ScoreSelector';

import QuestionBankController from '@/actions/App/Http/Controllers/Admin/QuestionBankController';
import QuestionController from '@/actions/App/Http/Controllers/Admin/QuestionController';

import OptionsEditor from '@/components/app/questions/option-editors/OptionsEditor';
import { Option } from '@/components/app/questions/option-editors/types';
import { generateDefaultOptions } from '@/components/app/questions/option-editors/utils';

interface EnumOption {
    value: string | number;
    name?: string;
}

interface QuestionFormData {
    question_bank_id: string;
    reading_material_id?: string; // Added
    content: string;
    question_type: string;
    difficulty_level: string;
    timer: number;
    score_value: number;
    options: Option[];
    question_media?: File | null;
    hint?: string;
    order?: number;
}

interface Props {
    question_bank_id: string;
    reading_material?: { id: string; title: string }; // Changed to object
    types: EnumOption[];
    difficulties: EnumOption[];
    timers: EnumOption[];
    scores: EnumOption[];
    order?: number;
}

export default function CreateQuestion({ question_bank_id, reading_material, types, difficulties, timers, scores, order }: Props) {
    // Default to MultipleChoice or first available type
    const defaultType = 'multiple_choice';

    const initialData: QuestionFormData = {
        question_bank_id: question_bank_id,
        reading_material_id: reading_material?.id, // Initialize
        content: '',
        question_type: defaultType,
        difficulty_level: 'sedang', // Default to Medium
        timer: 30, // Default to 30s
        score_value: 1, // Default to 1 point
        options: generateDefaultOptions(defaultType),
        question_media: null,
        hint: '',
        order: order,
    };

    const { data, setData, post, processing, errors } = useForm(initialData);
    const [previewQuestionMedia, setPreviewQuestionMedia] = useState<string | null>(null);

    const optionCache = useRef<Record<string, Option[]>>({});

    // Initialize cache with default options
    useEffect(() => {
        optionCache.current[defaultType] = initialData.options;
    }, []);

    const handleTypeChange = (value: string) => {
        // Save current options to cache before switching
        optionCache.current[data.question_type] = data.options;

        let newOptions: Option[];

        // Check if we have cached options for the new type
        if (optionCache.current[value]) {
            newOptions = optionCache.current[value];
        } else {
            newOptions = generateDefaultOptions(value);
        }

        setData(data => ({
            ...data,
            question_type: value,
            options: newOptions
        }));
    };

    const [validationError, setValidationError] = useState<string | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        // 1. Validate Question Content
        if (!data.content || data.content.trim() === '') {
            setValidationError('Konten soal wajib diisi.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 2. Validate Options Existence
        if (!data.options || data.options.length === 0) {
            setValidationError('Opsi jawaban harus tersedia.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 3. Validate Correct Answer
        const hasCorrectAnswer = data.options.some(opt => opt.is_correct);
        if (!hasCorrectAnswer) {
            setValidationError('Harus ada setidaknya satu kunci jawaban yang dipilih.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        post(QuestionController.store().url, {
            forceFormData: true,
            onError: () => {
                setValidationError("Terjadi kesalahan saat menyimpan. Periksa kembali inputan anda.");
            }
        });
    };

    const handleQuestionMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('question_media', file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewQuestionMedia(objectUrl);
        }
    };

    const removeQuestionMedia = () => {
        setData('question_media', null);
        setPreviewQuestionMedia(null);
    };

    return (
        <div className="min-h-screen bg-muted/40 flex flex-col">
            <Head title="Buat Soal Baru" />

            {/* TOPBAR */}
            <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
                <Link
                    href={QuestionBankController.edit(question_bank_id).url}
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

                {validationError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error Validasi</AlertTitle>
                        <AlertDescription>
                            {validationError}
                        </AlertDescription>
                    </Alert>
                )}

                {reading_material && (
                    <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertTitle className="text-blue-800 dark:text-blue-300">Terhubung dengan Bahan Bacaan</AlertTitle>
                        <AlertDescription className="text-blue-600 dark:text-blue-400">
                            Pertanyaan ini akan terhubung dengan: <strong>{reading_material.title}</strong>
                        </AlertDescription>
                    </Alert>
                )}

                {/* QUESTION CARD */}
                <Card className="border-primary/10 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Konten Soal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RichTextEditor
                            value={data.content}
                            onChange={(value) => setData('content', value)}
                            placeholder="Tuliskan pertanyaan di sini..."
                            className="min-h-[120px]"
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

                {/* HINT CARD */}
                <Card className="border-primary/10 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Hint (Bantuan)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RichTextEditor
                            value={data.hint || ''}
                            onChange={(value) => setData('hint', value)}
                            placeholder="Tuliskan hint atau bantuan untuk siswa di sini (opsional)..."
                            className="min-h-[80px]"
                        />
                    </CardContent>
                </Card>

                {/* OPTIONS EDITOR */}
                <OptionsEditor
                    type={data.question_type}
                    options={data.options}
                    onChange={(newOptions) => setData('options', newOptions)}
                    errors={errors}
                />

            </div>
        </div>
    );
}
