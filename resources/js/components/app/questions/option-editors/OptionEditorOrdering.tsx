import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Image as ImageIcon, X, GripVertical } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Option, OptionEditorProps } from './types';
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

interface SortableOptionItemProps {
    id: string;
    option: Option;
    index: number;
    updateOption: (index: number, field: keyof Option, value: any) => void;
    removeOption: (index: number) => void;
    handleOptionFileChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    removeOptionMedia: (index: number) => void;
}

function SortableOptionItem({
    id,
    option,
    index,
    updateOption,
    removeOption,
    handleOptionFileChange,
    removeOptionMedia
}: SortableOptionItemProps) {
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
            className="flex flex-col gap-2 p-4 border rounded-md bg-card relative group"
        >
            <div className="flex items-center gap-3">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab hover:text-primary active:cursor-grabbing text-muted-foreground p-1 rounded-sm hover:bg-muted"
                >
                    <GripVertical className="h-5 w-5" />
                </div>

                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
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

            {/* Media Upload */}
            <div className="ml-14 mt-2 space-y-2">
                <div className="flex items-start gap-4">
                    {(!option.delete_media && (option.media_url || option.media_file)) ? (
                        <div className="relative group/media">
                            <img
                                src={option.media_file ? URL.createObjectURL(option.media_file) : option.media_url!}
                                alt={`Preview Step ${index + 1}`}
                                className="h-24 w-auto min-w-[80px] object-contain rounded-md border bg-muted"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover/media:opacity-100 transition-opacity"
                                onClick={() => removeOptionMedia(index)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <div className="h-24 w-24 flex items-center justify-center rounded-md border border-dashed bg-muted/50 text-muted-foreground">
                            <ImageIcon className="h-6 w-6 opacity-50" />
                        </div>
                    )}

                    <div className="space-y-2 pt-2">
                        <Label htmlFor={`order-file-${option.option_key}`} className="cursor-pointer text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                            {option.media_url || option.media_file ? "Ganti Gambar" : "Tambah Gambar"}
                        </Label>
                        <Input
                            id={`order-file-${option.option_key}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleOptionFileChange(index, e)}
                            className="max-w-xs h-8 text-xs"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OptionEditorOrdering({ options, onChange }: OptionEditorProps) {
    // Generic update helper
    const updateOptionRaw = (index: number, updates: Partial<Option>) => {
        const newOpts = [...options];
        newOpts[index] = { ...newOpts[index], ...updates };
        onChange(newOpts);
    };

    const updateOption = (index: number, field: keyof Option, value: any) => {
        const newOpts = [...options];
        newOpts[index] = { ...newOpts[index], [field]: value };
        onChange(newOpts);
    };

    const handleOptionFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            updateOptionRaw(index, {
                media_file: file,
                delete_media: false
            });
        }
    };

    const removeOptionMedia = (index: number) => {
        updateOptionRaw(index, {
            media_file: null,
            media_url: null,
            delete_media: true
        });
    };

    const addOption = () => {
        onChange([...options, {
            option_key: crypto.randomUUID(),
            content: '',
            is_correct: true, // Ordering items are implicitly correct in their sequence definition
            order: options.length,
            media_url: null,
            media_file: null
        }]);
    };

    const removeOption = (index: number) => {
        const newOpts = options.filter((_, i) => i !== index);
        // Re-index remaining options order
        const reorderedOpts = newOpts.map((opt, idx) => ({
            ...opt,
            order: idx
        }));
        onChange(reorderedOpts);
    };

    // Drag and Drop Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = options.findIndex((item) => item.option_key === active.id);
            const newIndex = options.findIndex((item) => item.option_key === over?.id);

            const newOrder = arrayMove(options, oldIndex, newIndex);

            // Update order property to reflect new sequence
            const updatedOrder = newOrder.map((opt, idx) => ({
                ...opt,
                order: idx
            }));

            onChange(updatedOrder);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Urutkan opsi di bawah ini sesuai urutan yang benar. Geser ikon grip untuk mengubah urutan.
            </p>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={options.map(opt => opt.option_key)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {options.map((option, index) => (
                            <SortableOptionItem
                                key={option.option_key}
                                id={option.option_key}
                                option={option}
                                index={index}
                                updateOption={updateOption}
                                removeOption={removeOption}
                                handleOptionFileChange={handleOptionFileChange}
                                removeOptionMedia={removeOptionMedia}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <Button variant="outline" onClick={addOption} className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Tambah Langkah
            </Button>
        </div>
    );
}
