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

interface Option {
    id?: string;
    option_key: string;
    content: string;
    is_correct: boolean;
    order: number;
    metadata?: any;
    media_url?: string | null;
    media_file?: File | null;
    delete_media?: boolean;
}

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
        post(QuestionController.update(question.id).url);
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


function OptionsEditor({ type, options, onChange, errors }: { type: string, options: Option[], onChange: (opts: Option[]) => void, errors: any }) {

    // Initialize default options if empty based on type
    useEffect(() => {
        if (options.length === 0) {
            initializeOptions(type);
        }
    }, [type]);

    const initializeOptions = (qType: string) => {
        if (options.length > 0) return; // Don't override if exists

        let newOps: Option[] = [];
        if (qType === 'multiple_choice' || qType === 'multiple_selection') {
            newOps = ['A', 'B', 'C', 'D'].map((key, i) => ({
                option_key: key,
                content: '',
                is_correct: false,
                order: i,
                media_url: null,
                media_file: null
            }));
        } else if (qType === 'true_false') {
            newOps = [
                { option_key: 'T', content: 'Benar', is_correct: true, order: 0 },
                { option_key: 'F', content: 'Salah', is_correct: false, order: 1 }
            ];
        } else if (qType === 'matching') {
            // 4 pairs default
            newOps = Array.from({ length: 4 }).flatMap((_, i) => [
                { option_key: `L${i + 1}`, content: '', is_correct: true, order: i * 2, metadata: { side: 'left', pair_id: i + 1, match_with: `R${i + 1}` } },
                { option_key: `R${i + 1}`, content: '', is_correct: true, order: i * 2 + 1, metadata: { side: 'right', pair_id: i + 1, match_with: `L${i + 1}` } }
            ]);
        }
        if (newOps.length > 0) onChange(newOps);
    };

    const updateOption = (index: number, field: keyof Option, value: any) => {
        const newOpts = [...options];
        newOpts[index] = { ...newOpts[index], [field]: value };

        // Handle Logic for Single Choice (Radio behavior)
        if (type === 'multiple_choice' || type === 'true_false') {
            if (field === 'is_correct' && value === true) {
                // Uncheck others
                newOpts.forEach((opt, i) => {
                    if (i !== index) opt.is_correct = false;
                });
            }
        }

        onChange(newOpts);
    };

    const handleOptionFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            updateOption(index, 'media_file', file);
            updateOption(index, 'delete_media', false);
        }
    };

    const removeOptionMedia = (index: number) => {
        updateOption(index, 'media_file', null);
        updateOption(index, 'media_url', null); // Clear existing URL preview
        updateOption(index, 'delete_media', true);
    };

    const addOption = () => {
        const nextKey = String.fromCharCode(65 + options.length); // E, F...
        onChange([...options, {
            option_key: nextKey,
            content: '',
            is_correct: false,
            order: options.length
        }]);
    };

    const removeOption = (index: number) => {
        const newOpts = options.filter((_, i) => i !== index);
        // Re-key if necessary for A, B, C... but maybe user wants custom keys? 
        // For standard factory behavior we re-key or keep existing?
        // Let's re-key for MC for cleanliness
        if (type === 'multiple_choice' || type === 'multiple_selection') {
            newOpts.forEach((o, i) => o.option_key = String.fromCharCode(65 + i));
        }
        onChange(newOpts);
    };

    // --- RENDERERS ---

    if (type === 'multiple_choice' || type === 'multiple_selection') {
        return (
            <div className="space-y-4">
                {options.map((option, index) => (
                    <Card key={index}>
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className="pt-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold">
                                    {option.option_key}
                                </span>
                            </div>
                            <div className="flex-1 space-y-3">
                                <Textarea
                                    value={option.content}
                                    onChange={(e) => updateOption(index, 'content', e.target.value)}
                                    placeholder={`Jawaban ${option.option_key}`}
                                    className="resize-none min-h-[80px]"
                                />

                                <div className="flex items-center gap-4">
                                    {/* Control Correctness */}
                                    <div className="flex items-center gap-2">
                                        {type === 'multiple_choice' ? (
                                            <div className="flex items-center gap-2 cursor-pointer p-1" onClick={() => updateOption(index, 'is_correct', true)}>
                                                <div className={`h-4 w-4 rounded-full border border-primary flex items-center justify-center ${option.is_correct ? 'bg-primary' : ''}`}>
                                                    {option.is_correct && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                                                </div>
                                                <Label className="cursor-pointer">Benar</Label>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`opt-${index}`}
                                                    checked={option.is_correct}
                                                    onCheckedChange={(c) => updateOption(index, 'is_correct', !!c)}
                                                />
                                                <Label htmlFor={`opt-${index}`}>Benar</Label>
                                            </div>
                                        )}
                                    </div>

                                    <div className="h-4 w-px bg-border" />

                                    {/* Media Control */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor={`file-${index}`} className="cursor-pointer flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2 py-1 rounded-md">
                                                <ImageIcon className="h-3.5 w-3.5" />
                                                {option.media_url || option.media_file ? "Ganti Gambar" : "Tambah Gambar"}
                                            </Label>
                                            <Input
                                                id={`file-${index}`}
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleOptionFileChange(index, e)}
                                            />

                                            {(option.media_url || option.media_file) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-destructive hover:bg-destructive/10 text-xs"
                                                    onClick={() => removeOptionMedia(index)}
                                                >
                                                    Hapus
                                                </Button>
                                            )}
                                        </div>

                                        {/* File Name Indicator (if new file selected) */}
                                        {option.media_file && (
                                            <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                                                {option.media_file.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Media Preview */}
                                {(option.media_url || option.media_file) && !option.delete_media && (
                                    <div className="mt-3 p-2 border rounded-md bg-muted/30">
                                        <p className="text-[10px] text-muted-foreground mb-1">Preview Gambar:</p>
                                        <img
                                            src={option.media_file ? URL.createObjectURL(option.media_file) : option.media_url!}
                                            alt={`Preview Opsi ${option.option_key}`}
                                            className="h-32 w-auto min-w-[100px] object-contain rounded-sm border bg-background"
                                        />
                                    </div>
                                )}
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeOption(index)} className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                <Button variant="outline" onClick={addOption} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Tambah Opsi
                </Button>
            </div>
        );
    }

    if (type === 'true_false') {
        return (
            <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                    <div key={index}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all relative ${option.is_correct ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                        onClick={() => updateOption(index, 'is_correct', true)}
                    >
                        <div className="flex items-center justify-between z-10 relative">
                            <span className="font-semibold text-lg">{option.content}</span>
                            {option.is_correct && <CheckSquare className="h-5 w-5 text-primary" />}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'numerical_input') {
        // Find existing or create one default option
        const numOption = options[0] || { option_key: 'NUM', content: '', is_correct: true, order: 0, metadata: {} };
        const meta = numOption.metadata || {};

        const updateNum = (field: string, val: any, isMeta = false) => {
            if (isMeta) {
                const newMeta = { ...meta, [field]: val };
                updateOption(0, 'metadata', newMeta);
            } else {
                updateOption(0, field as keyof Option, val);
            }
        };

        return (
            <Card>
                <CardHeader><CardTitle className="text-base">Jawaban Angka</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Jawaban Benar (Angka)</Label>
                            <Input
                                type="number"
                                step="any"
                                value={numOption.content}
                                onChange={(e) => updateNum('content', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Toleransi (+/-)</Label>
                            <Input
                                type="number"
                                step="any"
                                value={meta.tolerance || 0}
                                onChange={(e) => updateNum('tolerance', parseFloat(e.target.value), true)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Satuan (Opsional)</Label>
                        <Input
                            value={meta.unit || ''}
                            onChange={(e) => updateNum('unit', e.target.value, true)}
                            placeholder="Contoh: cm, kg, m²"
                        />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (type === 'matching') {
        const leftOpts = options.filter(o => o.metadata?.side === 'left');

        const updatePair = (pairId: number, side: 'left' | 'right', val: string) => {
            const idx = options.findIndex(o => o.metadata?.pair_id === pairId && o.metadata?.side === side);
            if (idx >= 0) {
                updateOption(idx, 'content', val);
            }
        };

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-[1fr,auto,1fr] gap-4 font-semibold text-muted-foreground mb-2 px-4">
                    <div>Kolom Kiri</div>
                    <div></div>
                    <div>Kolom Kanan (Jawaban)</div>
                </div>
                {leftOpts.map((leftOpt, i) => {
                    const pairId = leftOpt.metadata?.pair_id;
                    const rightOpt = options.find(o => o.metadata?.pair_id === pairId && o.metadata?.side === 'right');

                    return (
                        <div key={pairId ?? `pair-${i}`} className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                            <Input
                                value={leftOpt.content}
                                onChange={(e) => updatePair(pairId, 'left', e.target.value)}
                                placeholder={`Item ${pairId}`}
                            />
                            <div className="text-muted-foreground"><GitMerge className="h-4 w-4" /></div>
                            <Input
                                value={rightOpt?.content || ''}
                                onChange={(e) => updatePair(pairId, 'right', e.target.value)}
                                placeholder={`Pasangan ${pairId}`}
                            />
                        </div>
                    )
                })}
            </div>
        );
    }

    if (type === 'ordering') {
        return (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">Urutkan opsi di bawah ini sesuai urutan yang benar.</p>
                {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {index + 1}
                        </div>
                        <Input
                            value={option.content}
                            onChange={(e) => updateOption(index, 'content', e.target.value)}
                            placeholder={`Langkah ke-${index + 1}`}
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeOption(index)} className="text-muted-foreground">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button variant="outline" onClick={addOption} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" /> Tambah Langkah
                </Button>
            </div>
        );
    }

    return <div className="text-muted-foreground italic">Editor untuk tipe soal ini belum tersedia.</div>;
}
