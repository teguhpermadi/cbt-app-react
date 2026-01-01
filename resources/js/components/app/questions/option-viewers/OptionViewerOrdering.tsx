import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OptionViewerProps } from './OptionViewerSingleChoice';
import MathRenderer from '../MathRenderer';

interface SortableItemProps {
    id: string;
    content: string;
    mediaUrl?: string;
}

function SortableItem({ id, content, mediaUrl }: SortableItemProps) {
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
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg",
                isDragging && "opacity-50 ring-2 ring-blue-500"
            )}
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
                <GripVertical className="w-5 h-5" />
            </button>
            <div className="flex-1">
                {mediaUrl && (
                    <div className="mb-2">
                        <img
                            src={mediaUrl}
                            alt="Option Media"
                            className="max-h-[100px] w-auto rounded-md object-contain border bg-white dark:bg-slate-900"
                        />
                    </div>
                )}
                <MathRenderer className="text-slate-700 dark:text-slate-300" content={content} />
            </div>
        </div>
    );
}

export default function OptionViewerOrdering({ options, value, onChange, disabled }: OptionViewerProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Initialize ordered items from value or default order
    const orderedKeys = Array.isArray(value) && value.length > 0
        ? value
        : Object.keys(options || {});

    const handleDragEnd = (event: DragEndEvent) => {
        if (disabled) return;

        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = orderedKeys.indexOf(active.id as string);
            const newIndex = orderedKeys.indexOf(over.id as string);

            const newOrder = arrayMove(orderedKeys, oldIndex, newIndex);
            onChange(newOrder);
        }
    };

    return (
        <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Seret dan lepas untuk mengurutkan jawaban:
            </p>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={orderedKeys}
                    strategy={verticalListSortingStrategy}
                >
                    {orderedKeys.map((key) => {
                        const option = options?.[key];
                        if (!option) return null;
                        return (
                            <SortableItem
                                key={key}
                                id={key}
                                content={option.content}
                                mediaUrl={option.media_url}
                            />
                        );
                    })}
                </SortableContext>
            </DndContext>
        </div>
    );
}
