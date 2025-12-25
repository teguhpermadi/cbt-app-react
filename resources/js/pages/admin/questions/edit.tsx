import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Plus, Trash2, AlertCircle } from 'lucide-react';
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
}

interface EnumOption {
    value: string | number;
    name?: string; // or relying on manual mapping if name isn't passed
}

interface QuestionFormData {
    content: string;
    question_type: string;
    difficulty_level: string;
    timer: number;
    score_value: number;
    options: Option[];
}

interface Props {
    question: Question;

    difficulties: EnumOption[];
    timers: EnumOption[];
    scores: EnumOption[];
}

export default function EditQuestion({ question, difficulties, timers, scores }: Props) {
    const initialData: QuestionFormData = {
        content: question.content || '',
        question_type: question.question_type,
        difficulty_level: question.difficulty_level,
        timer: question.timer,
        score_value: question.score_value,
        options: question.options,
    };

    const { data, setData, put, processing, errors, isDirty } = useForm(initialData);

    // Reset options when type changes if needed, or handle conversion
    // For now, we keep it simple: if type changes, we might need to reset structure
    // But let's allow user to keep content if possible.

    const handleTypeChange = (value: string) => {
        // If type changes significantly, we might want to reset options
        // For now just update type
        setData('question_type', value);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(QuestionController.update(question.id).url);
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
                    </CardContent>
                </Card>

                {/* OPTIONS EDITOR */}
                <OptionsEditor
                    type={data.question_type}
                    options={data.options}
                    onChange={(newOptions) => setData('options', newOptions)}
                />

            </div>
        </div>
    );
}


function OptionsEditor({ type, options, onChange }: { type: string, options: Option[], onChange: (opts: Option[]) => void }) {

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
                order: i
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
                            <div className="flex-1 space-y-2">
                                <Textarea
                                    value={option.content}
                                    onChange={(e) => updateOption(index, 'content', e.target.value)}
                                    placeholder={`Jawaban ${option.option_key}`}
                                    className="resize-none"
                                />
                                <div className="flex items-center gap-2">
                                    {type === 'multiple_choice' ? (
                                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => updateOption(index, 'is_correct', true)}>
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
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${option.is_correct ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                        onClick={() => updateOption(index, 'is_correct', true)}
                    >
                        <div className="flex items-center justify-between">
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
        // Distinct left and right options
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
