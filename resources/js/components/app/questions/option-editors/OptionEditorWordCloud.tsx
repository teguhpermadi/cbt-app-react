import React, { useState } from 'react';
import { Option, OptionEditorProps } from './types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, RefreshCw, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Helper component for sortable item
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 p-3 border rounded-md ${isDistractor ? 'bg-orange-50 border-orange-200' : 'bg-card'}`}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab hover:text-primary active:cursor-grabbing text-muted-foreground p-1"
            >
                <GripVertical className="h-4 w-4" />
            </div>

            <span className={`text-xs font-bold w-6 text-center ${isDistractor ? 'text-orange-500' : 'text-primary'}`}>
                {isDistractor ? 'Dist' : index + 1}
            </span>

            <Input
                value={option.content}
                onChange={(e) => updateOption(index, e.target.value)}
                className="h-8"
                placeholder={isDistractor ? "Kata Pengalih" : "Kata / Frasa"}
            />

            <Button
                variant="ghost"
                size="icon"
                onClick={() => removeOption(index)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}

export default function OptionEditorWordCloud({ options, onChange }: OptionEditorProps) {
    const [sentence, setSentence] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const generateFromSentence = () => {
        if (!sentence.trim()) return;

        const words = sentence.trim().split(/\s+/);
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

    const correctOptions = options.filter(o => o.is_correct);
    const distractorOptions = options.filter(o => !o.is_correct);

    // We keep them in one list for global dragging if desired, or separate?
    // Usually standard drag and drop editor keeps one list.
    // If we mix them, the order logic gets tricky.
    // Let's keep one list `options` which is the source of truth, but maybe visualize them separately?
    // dragging between lists is complex. 
    // SIMPLE APPROACH: Just one list. The order visible here defines the "Correct Answer" sequence.
    // Distractors can be dragged to the end or beginning, but they are marked as distractor.
    // Actually, if it's a distractor, its position in "Correct Answer" is irrelevant.
    // BUT checking "Answer Key" usually shows the correct sequence.
    // So `is_correct=true` items must be in the correct relative order.
    // `is_correct=false` items are just extras.

    // Changing approach: Separate lists for clearer UI.
    // Use `updateOption` carefully.

    return (
        <div className="space-y-6">
            <div className="space-y-2 p-4 border rounded-lg bg-slate-50">
                <Label>Generate dari Kalimat</Label>
                <div className="flex gap-2">
                    <Textarea
                        value={sentence}
                        onChange={(e) => setSentence(e.target.value)}
                        placeholder="Ketik kalimat lengkap yang benar di sini..."
                        className="bg-white"
                        rows={2}
                    />
                    <Button onClick={generateFromSentence} variant="secondary" className="h-auto">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Tombol generate akan memecah kalimat menjadi kata-kata dan mereset opsi di bawah.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Susunan Token & Distractor</Label>
                    <div className="space-x-2">
                        <Button size="sm" variant="outline" onClick={() => addOption(false)}>
                            <Plus className="w-4 h-4 mr-2" /> Kata Benar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => addOption(true)} className="text-orange-600 border-orange-200 hover:bg-orange-50">
                            <Plus className="w-4 h-4 mr-2" /> Distractor
                        </Button>
                    </div>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={options.map(opt => opt.option_key)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
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
                        </div>
                    </SortableContext>
                </DndContext>

                {options.length === 0 && (
                    <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground italic">
                        Belum ada opsi kata. Generate dari kalimat atau tambah manual.
                    </div>
                )}
            </div>

            <div className="bg-blue-50 p-3 rounded text-xs text-blue-700">
                <span className="font-bold">Info:</span> Item yang ditandai sebagai "Distractor" (Orange) akan muncul di pilihan jawaban siswa tetapi TIDAK masuk dalam rangkaian jawaban yang benar. Urutan item "Benar" di atas menentukan urutan jawaban yang valid.
            </div>
        </div>
    );
}
