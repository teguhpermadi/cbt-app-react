import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor, useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from "@/components/ui/card";

interface Props {
    options: any; // Single option with sentence
    value: any;   // Student answer (array of words)
    onChange?: (value: any) => void;
    disabled?: boolean;
}

interface SortableWordProps {
    id: string;
    word: string;
    disabled?: boolean;
}

function SortableWord({ id, word, disabled }: SortableWordProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`px-3 py-2 bg-background border rounded-md shadow-sm cursor-grab active:cursor-grabbing hover:border-primary select-none ${disabled ? 'cursor-default opacity-80' : ''}`}
        >
            {word}
        </div>
    );
}

// Helper component for droppable areas
function DroppableContainer({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) {
    const { setNodeRef } = useDroppable({ id });
    return (
        <Card ref={setNodeRef} id={id} className={className}>
            {children}
        </Card>
    );
}

export default function OptionViewerArrangeWords({ options, value, onChange, disabled }: Props) {
    // Extract metadata robustly
    const getOption = (opts: any) => {
        if (!opts) return null;
        if (Array.isArray(opts)) return opts.length > 0 ? opts[0] : null;
        if (opts.content) return opts; // Already the option object
        // If it's an object keyed by ID/Key (e.g. from snapshot)
        const keys = Object.keys(opts);
        if (keys.length > 0) return opts[keys[0]];

        return null;
    };

    const option = getOption(options);
    const sentence = option?.content || '';
    const delimiter = option?.metadata?.delimiter || ' ';

    // State
    const [wordBank, setWordBank] = useState<string[]>([]);
    const [userAnswer, setUserAnswer] = useState<string[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Initialize
    useEffect(() => {
        if (!sentence) return;

        // Create base pool of tokens with unique IDs
        const tokens = sentence.split(delimiter).filter((t: string) => t.length > 0);
        // Map to unique IDs: "word::originalIndex" to handle duplicates and stability
        // We use index as part of ID to ensure uniqueness for duplicate words
        const allItems = tokens.map((text, idx) => `${text}::${idx}`);

        // If we have a saved value (student answer), reconstruct state
        if (Array.isArray(value) && value.length > 0) {
            const usedIds: Set<string> = new Set();
            const reconstructedAnswer: string[] = [];

            // Map student answer strings back to available IDs
            value.forEach(word => {
                // Find first available ID for this word that hasn't been used
                const match = allItems.find(id => {
                    const [w, _] = id.split('::');
                    return w === word && !usedIds.has(id);
                });

                if (match) {
                    reconstructedAnswer.push(match);
                    usedIds.add(match);
                }
            });

            setUserAnswer(reconstructedAnswer);

            // Remaining items go to wordBank
            const remaining = allItems.filter(id => !usedIds.has(id));
            // Shuffle remaining items
            setWordBank(remaining.sort(() => Math.random() - 0.5));

        } else {
            // Fresh start
            const shuffled = [...allItems].sort(() => Math.random() - 0.5);
            setWordBank(shuffled);
            setUserAnswer([]);
        }
    }, [sentence, delimiter]); // Only re-run if content changes. Value changes are handled by internal state.

    // But wait, if VALUE changes externally?
    // We only re-sync if value is provided and different? 
    // Let's stick to local state management for DnD, and sync UP to parent.

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor)
    );

    // Handlers
    const handleDragStart = (event: any) => {
        if (disabled) return;
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        if (disabled) return;
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeItem = active.id;
        const overId = over.id;

        // Find where the item IS
        const inBank = wordBank.includes(activeItem);
        const inAnswer = userAnswer.includes(activeItem);

        // Find where it is GOING
        const overBank = overId === 'word-bank' || wordBank.includes(overId);
        const overAnswer = overId === 'answer-area' || userAnswer.includes(overId);

        if (inBank && overAnswer) {
            // Move from Bank -> Answer
            setWordBank(items => items.filter(i => i !== activeItem));
            setUserAnswer(items => {
                const newItems = [...items];
                const overIndex = items.indexOf(overId);
                if (overIndex >= 0) {
                    newItems.splice(overIndex, 0, activeItem);
                } else {
                    newItems.push(activeItem);
                }
                triggerChange(newItems);
                return newItems;
            });
        } else if (inAnswer && overBank) {
            // Move from Answer -> Bank
            setUserAnswer(items => {
                const newItems = items.filter(i => i !== activeItem);
                triggerChange(newItems);
                return newItems;
            });
            setWordBank(items => [...items, activeItem]);
        } else if (inAnswer && overAnswer) {
            // Reorder in Answer
            if (activeItem !== overId) {
                setUserAnswer(items => {
                    const oldIndex = items.indexOf(activeItem);
                    const newIndex = items.indexOf(overId);
                    const newItems = arrayMove(items, oldIndex, newIndex);
                    triggerChange(newItems);
                    return newItems;
                });
            }
        } else if (inBank && overBank) {
            // Reorder in Bank (Optional)
            if (activeItem !== overId) {
                setWordBank(items => {
                    const oldIndex = items.indexOf(activeItem);
                    const newIndex = items.indexOf(overId);
                    return arrayMove(items, oldIndex, newIndex);
                });
            }
        }
    };

    const triggerChange = (newAnswerIds: string[]) => {
        // Strip the unique ID suffix to get raw words
        const rawWords = newAnswerIds.map(id => id.split('::')[0]);
        onChange?.(rawWords);
    };

    const getWord = (id: string) => id.split('::')[0];

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-6">
                {/* Answer Area */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Jawaban Anda:</h3>
                    <DroppableContainer
                        id="answer-area"
                        className={`min-h-[80px] p-4 flex flex-wrap gap-2 transition-colors ${userAnswer.length === 0 ? 'bg-muted/50 border-dashed' : 'bg-background'}`}
                    >
                        <SortableContext items={userAnswer} strategy={horizontalListSortingStrategy}>
                            {userAnswer.map(id => (
                                <SortableWord key={id} id={id} word={getWord(id)} disabled={disabled} />
                            ))}
                        </SortableContext>
                        {userAnswer.length === 0 && (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm pointer-events-none">
                                Tarik kata ke sini untuk menyusun kalimat
                            </div>
                        )}
                    </DroppableContainer>
                </div>

                {/* Word Bank */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Pilihan Kata:</h3>
                    <DroppableContainer id="word-bank" className="p-4 bg-muted/20 border-none">
                        <div className="flex flex-wrap gap-2">
                            <SortableContext items={wordBank} strategy={horizontalListSortingStrategy}>
                                {wordBank.map(id => (
                                    <SortableWord key={id} id={id} word={getWord(id)} disabled={disabled} />
                                ))}
                            </SortableContext>
                        </div>
                    </DroppableContainer>
                </div>
            </div>

            <DragOverlay>
                {activeId ? (
                    <div className="px-3 py-2 bg-background border rounded-md shadow-lg cursor-grabbing opacity-90 scale-105">
                        {getWord(activeId)}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

