import React, { useEffect, useState, useRef } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { OptionViewerProps } from './OptionViewerSingleChoice';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

// --- Sortable Item Component --- //
interface SortableItemProps {
    id: string;
    content: string;
    disabled?: boolean;
    isOverlay?: boolean;
}

function SortableItem({ id, content, disabled, isOverlay }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id,
        disabled
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "relative group flex items-center justify-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm cursor-grab active:cursor-grabbing select-none hover:border-primary/50 hover:shadow-md transition-all text-sm font-medium",
                isDragging && "opacity-30",
                isOverlay && "opacity-100 ring-2 ring-primary scale-105 z-50 shadow-xl",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            {content}
        </div>
    );
}

// --- Main Component --- //
export default function OptionViewerWordCloud({ options, value, onChange, disabled }: OptionViewerProps) {
    // Value from props is the Answer List keys
    const answerKeys: string[] = Array.isArray(value) ? value : [];

    // Pool keys are managed locally. 
    // Initial load: all options NOT in answerKeys, shuffled.
    const [poolKeys, setPoolKeys] = useState<string[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (!options) return;

        // Only initialize pool once or if check for inconsistency?
        // If we strictly rely on props for Answer, Pool is the rest.
        // But we want to preserve Pool order if user drags back and forth.
        // So we only re-calculate pool if options changed drastically or first run.

        const allKeys = Object.keys(options);
        const currentAnswerSet = new Set(answerKeys);

        // Find keys that should be in pool
        const validPoolKeys = allKeys.filter(k => !currentAnswerSet.has(k));

        if (!initialized.current) {
            // Shuffle only on first mount
            const shuffled = [...validPoolKeys].sort(() => Math.random() - 0.5);
            setPoolKeys(shuffled);
            initialized.current = true;
        } else {
            // If props update (e.g. from server), ensures we have correct items in pool
            // We want to keep existing poolKeys order but add missing / remove stale.
            const existingPoolSet = new Set(poolKeys);

            // Items in pool that are no longer valid (deleted option or moved to answer externally)
            const cleanPool = poolKeys.filter(k => validPoolKeys.includes(k));

            // Items that are valid but not in pool (newly added option or removed from answer externally)
            const missing = validPoolKeys.filter(k => !existingPoolSet.has(k));

            if (missing.length > 0 || cleanPool.length !== poolKeys.length) {
                setPoolKeys([...cleanPool, ...missing]);
            }
        }
    }, [options, value]); // We depend on value to know what's NOT in pool

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findContainer = (id: string): 'pool' | 'answer' | undefined => {
        if (answerKeys.includes(id)) return 'answer';
        if (poolKeys.includes(id)) return 'pool';
        return undefined;
    };

    const handleDragStart = (event: DragStartEvent) => {
        if (disabled) return;
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        if (disabled) return;
        const { active, over } = event;
        if (!over) return;

        const activeIdStr = active.id as string;
        const overIdStr = over.id as string;

        // Find containers
        const activeContainer = findContainer(activeIdStr);
        // Over container could be the 'sortable-context' ID or an item ID
        const overContainer = overIdStr === 'pool-area' ? 'pool' :
            overIdStr === 'answer-area' ? 'answer' :
                findContainer(overIdStr);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        // Moving between containers during drag (visual update)
        // We defer state updates to DragEnd for simpler logic usually, 
        // BUT for smooth sortable between lists, we typically need to update state on DragOver.
        // However, updating `onChange` (prop) on DragOver might be too aggressive/expensive.
        // Let's stick to DragEnd for moving items for now unless it feels laggy.
        // Actually dnd-kit recommends updating items on DragOver for connected lists.
        // But since `onChange` informs parent, let's try to handle it all in DragEnd for simplicity first.
    };

    const handleDragEnd = (event: DragEndEvent) => {
        if (disabled) {
            setActiveId(null);
            return;
        }

        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeIdStr = active.id as string;
        const overIdStr = over.id as string;

        const activeContainer = findContainer(activeIdStr);
        const overContainer = overIdStr === 'pool-area' ? 'pool' :
            overIdStr === 'answer-area' ? 'answer' :
                findContainer(overIdStr);

        if (!activeContainer || !overContainer) return;

        // 1. Same Container Reorder
        if (activeContainer === overContainer) {
            if (activeIdStr !== overIdStr) {
                if (activeContainer === 'answer') {
                    const oldIndex = answerKeys.indexOf(activeIdStr);
                    const newIndex = answerKeys.indexOf(overIdStr);
                    onChange(arrayMove(answerKeys, oldIndex, newIndex));
                } else {
                    const oldIndex = poolKeys.indexOf(activeIdStr);
                    const newIndex = poolKeys.indexOf(overIdStr);
                    setPoolKeys(arrayMove(poolKeys, oldIndex, newIndex));
                }
            }
            return;
        }

        // 2. Move between containers
        if (activeContainer === 'pool' && overContainer === 'answer') {
            // Remove from pool, Add to answer
            setPoolKeys(prev => prev.filter(k => k !== activeIdStr));

            const newAnswer = [...answerKeys];
            const overIndex = answerKeys.indexOf(overIdStr);

            if (overIndex >= 0) {
                newAnswer.splice(overIndex, 0, activeIdStr);
            } else {
                newAnswer.push(activeIdStr);
            }
            onChange(newAnswer);
        } else if (activeContainer === 'answer' && overContainer === 'pool') {
            // Remove from answer, Add to pool
            onChange(answerKeys.filter(k => k !== activeIdStr));

            const newPool = [...poolKeys];
            const overIndex = poolKeys.indexOf(overIdStr);

            if (overIndex >= 0) {
                newPool.splice(overIndex, 0, activeIdStr);
            } else {
                newPool.push(activeIdStr);
            }
            setPoolKeys(newPool);
        }
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            // onDragOver={handleDragOver} // Skipping DragOver for now, relying on DragEnd
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-6 select-none">
                {/* Answer Area */}
                <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">Jawaban Anda:</p>
                    <div
                        className={cn(
                            "min-h-[120px] p-4 rounded-xl border-2 border-dashed transition-colors flex flex-wrap content-start gap-2",
                            answerKeys.length > 0 ? "bg-white border-slate-300" : "bg-slate-50 border-slate-300",
                            !disabled && "hover:border-primary/40"
                        )}
                        id="answer-area"
                    >
                        <SortableContext
                            id="answer-context"
                            items={answerKeys}
                            strategy={rectSortingStrategy}
                        >
                            {answerKeys.length === 0 && (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 pointer-events-none text-sm italic">
                                    Geser kata ke sini...
                                </div>
                            )}
                            {answerKeys.map(key => (
                                <SortableItem
                                    key={key}
                                    id={key}
                                    content={options?.[key]?.content || "?"}
                                    disabled={disabled}
                                />
                            ))}
                        </SortableContext>
                    </div>
                </div>

                {/* Pool Area */}
                <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">Pilihan Kata:</p>
                    <div
                        className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl min-h-[80px] flex flex-wrap gap-2"
                        id="pool-area"
                    >
                        <SortableContext
                            id="pool-context"
                            items={poolKeys}
                            strategy={rectSortingStrategy}
                        >
                            {poolKeys.map(key => (
                                <SortableItem
                                    key={key}
                                    id={key}
                                    content={options?.[key]?.content || "?"}
                                    disabled={disabled}
                                />
                            ))}
                        </SortableContext>
                    </div>
                </div>
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeId ? (
                    <SortableItem
                        id={activeId}
                        content={options?.[activeId]?.content || "?"}
                        isOverlay
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
