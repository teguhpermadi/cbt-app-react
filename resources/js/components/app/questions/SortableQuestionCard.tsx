import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import QuestionCard from "./QuestionCard";
import { Question } from "./types";

interface SortableQuestionCardProps {
    question: Question;
    onUpdate?: (id: string, field: keyof Question, value: any) => void;
    onDelete?: (id: string) => void;
    onEdit?: (question: Question) => void;
    id?: string;
}

export function SortableQuestionCard({ question, onUpdate, onDelete, onEdit, id }: SortableQuestionCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group" id={id}>
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex items-center h-full"
            >
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <GripVertical className="size-5" />
                </div>
            </div>

            <QuestionCard
                question={question}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onEdit={onEdit}
            />
        </div>
    );
}
