import React, { useState, useEffect, useRef } from 'react';
import { Option, OptionEditorProps } from './types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, RefreshCw, XCircle, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

// Helper component for sortable item (Chip Style)
function SortableOptionItem({
    id,
    option,
    index,
    updateOption,
    removeOption,
    isDistractor
}: {
    id: string;
    option: Option;
    index: number;
    updateOption: (index: number, val: string) => void;
    removeOption: (index: number) => void;
    isDistractor?: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    // Auto-resize logic using a hidden span or simple ch units?
    // Using a simple style approach with `min-width` and letting content drive it if we used a span/div editable.
    // For Input, we can adjust `size` or `width` based on content length.
    // Let's us `size` attribute as a simple heuristic.

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative flex items-center gap-1.5 pl-1.5 pr-2 py-1.5 border rounded-full text-sm font-medium transition-all select-none hover:shadow-md max-w-full",
                isDistractor
                    ? "bg-orange-50 border-orange-200 text-orange-700 hover:border-orange-300"
                    : "bg-white border-slate-200 text-slate-700 hover:border-blue-300",
                isDragging && "scale-105 shadow-xl rotate-2"
            )}
        >
            {/* Drag Handle - Explicitly visible on left */}
            <div
                {...attributes}
                {...listeners}
                className={cn(
                    "cursor-grab active:cursor-grabbing p-0.5 rounded-full",
                    isDistractor ? "text-orange-300 hover:text-orange-500 hover:bg-orange-100" : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
                )}
            >
                <GripVertical className="w-4 h-4" />
            </div>

            <input
                value={option.content}
                onChange={(e) => updateOption(index, e.target.value)}
                className="bg-transparent border-none outline-none text-left min-w-[20px]"
                // Simple auto-width heuristic: content length + padding chars (max 100ch)
                // Simple auto-width heuristic: content length + padding chars (max visual width 25ch, but allow up to 100 chars content)
                style={{ width: `${Math.min(Math.max(option.content.length, 2) + 2, 25)}ch` }}
                maxLength={100}
                placeholder="..."
                onMouseDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
            />

            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeOption(index); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Badge for Type (only relevant for distractors visually to differentiate) */}
            {isDistractor && (
                <div className="absolute -top-2 -right-1 text-[9px] px-1 rounded-full border shadow-sm bg-orange-100 border-orange-200 text-orange-600">
                    DIST
                </div>
            )}
        </div>
    );
}

export default function OptionEditorWordCloud({ options, onChange }: OptionEditorProps) {
    const [sentence, setSentence] = useState('');
    const [delimiter, setDelimiter] = useState('space');
    const [customDelimiter, setCustomDelimiter] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const generateFromSentence = () => {
        if (!sentence.trim()) return;

        let words: string[] = [];

        switch (delimiter) {
            case 'space':
                words = sentence.trim().split(/\s+/);
                break;
            case 'comma':
                words = sentence.split(',').map(s => s.trim()).filter(s => s.length > 0);
                break;
            case 'newline':
                words = sentence.split('\n').map(s => s.trim()).filter(s => s.length > 0);
                break;
            case 'pipe':
                words = sentence.split('|').map(s => s.trim()).filter(s => s.length > 0);
                break;
            case 'custom':
                if (customDelimiter) {
                    // Escape special regex characters if user types them (e.g. . or + or *)
                    // Simple escape approach
                    const escapedDelim = customDelimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    words = sentence.split(new RegExp(escapedDelim)).map(s => s.trim()).filter(s => s.length > 0);
                } else {
                    // Fallback to space if custom is empty? Or do nothing?
                    // Let's fallback to space to avoid confusion
                    words = sentence.trim().split(/\s+/);
                }
                break;
            default:
                words = sentence.trim().split(/\s+/);
        }

        const newOptions: Option[] = words.map((word, index) => ({
            option_key: crypto.randomUUID(),
            content: word,
            is_correct: true,
            order: index,
            media_url: null,
            media_file: null
        }));

        onChange(newOptions);
    };

    const clearAll = () => {
        if (confirm("Hapus semua opsi?")) {
            onChange([]);
        }
    };

    const addOption = (isDistractor: boolean = false) => {
        const correctCount = options.filter(o => o.is_correct).length;
        onChange([...options, {
            option_key: crypto.randomUUID(),
            content: '',
            is_correct: !isDistractor,
            order: isDistractor ? 999 : correctCount,
            media_url: null,
            media_file: null
        }]);
    };

    const updateOption = (index: number, val: string) => {
        const newOpts = [...options];
        newOpts[index] = { ...newOpts[index], content: val };
        onChange(newOpts);
    };

    const removeOption = (index: number) => {
        const newOpts = options.filter((_, i) => i !== index);
        // Re-calculate orders for correct items only
        let correctIdx = 0;
        const reordered = newOpts.map(opt => {
            if (opt.is_correct) {
                return { ...opt, order: correctIdx++ };
            }
            return opt;
        });
        onChange(reordered);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = options.findIndex((item) => item.option_key === active.id);
            const newIndex = options.findIndex((item) => item.option_key === over?.id);

            const newOpts = arrayMove(options, oldIndex, newIndex);

            // Fix orders
            let correctIdx = 0;
            const reordered = newOpts.map(opt => {
                if (opt.is_correct) {
                    return { ...opt, order: correctIdx++ };
                }
                return opt;
            });

            onChange(reordered);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                <div className="flex items-center justify-between">
                    <Label className="text-base">Membangun Kata / Kalimat</Label>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSentence('')}
                        className="text-muted-foreground h-auto px-2"
                        disabled={!sentence}
                    >
                        Reset Input
                    </Button>
                </div>

                <Textarea
                    value={sentence}
                    onChange={(e) => setSentence(e.target.value)}
                    placeholder="Ketik kalimat lengkap atau daftar kata di sini..."
                    className="bg-white min-h-[80px]"
                />

                <div className="flex flex-wrap items-end gap-3">
                    <div className="space-y-1.5 min-w-[140px]">
                        <Label className="text-xs">Pemisah (Delimiter)</Label>
                        <Select value={delimiter} onValueChange={setDelimiter}>
                            <SelectTrigger className="h-9 bg-white">
                                <SelectValue placeholder="Pilih delimiter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="space">Spasi (Auto)</SelectItem>
                                <SelectItem value="comma">Koma (,)</SelectItem>
                                <SelectItem value="newline">Baris Baru (Enter)</SelectItem>
                                <SelectItem value="pipe">Garis Tegak (|)</SelectItem>
                                <SelectItem value="custom">Custom...</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {delimiter === 'custom' && (
                        <div className="space-y-1.5 w-[100px] animate-in fade-in slide-in-from-left-2 duration-300">
                            <Label className="text-xs">Simbol</Label>
                            <Input
                                value={customDelimiter}
                                onChange={(e) => setCustomDelimiter(e.target.value)}
                                className="h-9 bg-white"
                                placeholder="Contoh: ;"
                            />
                        </div>
                    )}

                    <Button onClick={generateFromSentence} className="h-9">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate Tokens
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                    <div className="space-y-1">
                        <Label>Area Kerja Token</Label>
                        <p className="text-xs text-muted-foreground">
                            Geser token secara horizontal untuk mengatur urutan.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => addOption(false)} className="h-8">
                            <Plus className="w-3.5 h-3.5 mr-1" /> Benar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => addOption(true)} className="h-8 text-orange-600 border-orange-200 hover:bg-orange-50">
                            <Plus className="w-3.5 h-3.5 mr-1" /> Distractor
                        </Button>
                        {options.length > 0 && (
                            <Button size="sm" variant="ghost" onClick={clearAll} className="h-8 text-destructive hover:bg-destructive/10">
                                <XCircle className="w-4 h-4 mr-1" /> Hapus Semua
                            </Button>
                        )}
                    </div>
                </div>

                <div className="min-h-[100px] p-4 bg-slate-100 rounded-xl border border-slate-200 flex flex-wrap gap-2 items-start content-start">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={options.map(opt => opt.option_key)}
                            strategy={rectSortingStrategy}
                        >
                            {options.map((option, index) => (
                                <SortableOptionItem
                                    key={option.option_key}
                                    id={option.option_key}
                                    option={option}
                                    index={index}
                                    updateOption={updateOption}
                                    removeOption={removeOption}
                                    isDistractor={!option.is_correct}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>

                    {options.length === 0 && (
                        <div className="w-full h-full min-h-[60px] flex items-center justify-center text-muted-foreground italic text-sm">
                            Tidak ada token. Silakan generate dari kalimat atau tambah secara manual.
                        </div>
                    )}
                </div>

                <div className="flex gap-2 p-3 bg-blue-50 text-blue-800 rounded-md text-xs">
                    <span className="font-bold shrink-0">Tips:</span>
                    <span>
                        Token berwarna <strong>Putih</strong> adalah jawaban benar (kunci). Token <strong>Oranye</strong> adalah distractor (pengecoh).
                        Urutan token putih di "Area Kerja" menentukan Kunci Jawaban yang benar. Distractor akan diacak posisinya saat ditampilkan ke siswa.
                    </span>
                </div>
            </div>
        </div>
    );
}
