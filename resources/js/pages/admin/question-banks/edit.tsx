import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useDebounce } from 'use-debounce';

// Wayground Imports
// Wayground Imports
// import { index } from '@/routes/admin/question-banks'; // Removed invalid import
import QuestionBankController from '@/actions/App/Http/Controllers/Admin/QuestionBankController';
import QuestionController from '@/actions/App/Http/Controllers/Admin/QuestionController';

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
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { SortableQuestionCard } from '@/components/app/questions/SortableQuestionCard';
import QuestionCard from '@/components/app/questions/QuestionCard';
import { Question } from '@/components/app/questions/types';





import 'katex/dist/katex.min.css';

interface QuestionBank {


    id: number;
    name: string;
    subject_id: number;
    description: string | null;
    is_public: boolean;
}

interface EditProps {
    questionBank: QuestionBank;
    questions?: Question[];
}

export default function Edit({ questionBank, questions = [] }: EditProps) {
    const { data, setData, put, processing, errors, isDirty } = useForm({
        name: questionBank.name,
        subject_id: questionBank.subject_id,
        description: questionBank.description || '',
        is_public: questionBank.is_public,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Using Wayground Action
        put(QuestionBankController.update(questionBank.id).url);
    };

    const [sortedQuestions, setSortedQuestions] = useState(questions);

    useEffect(() => {
        setSortedQuestions(questions);
    }, [questions]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const scrollToId = params.get('scrollTo');
        if (scrollToId) {
            setTimeout(() => {
                const element = document.getElementById(scrollToId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Provide visual feedback
                    element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                    setTimeout(() => element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'), 2000);

                    // Clean up query param
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                }
            }, 500);
        }
    }, [questions]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setSortedQuestions((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newOrder = arrayMove(items, oldIndex, newIndex);

                // Send reorder request to backend
                router.post('/admin/questions/reorder', {
                    ids: newOrder.map(q => q.id)
                }, {
                    preserveScroll: true,
                    preserveState: true,
                });

                return newOrder;
            });
        }
    };

    const handleQuestionUpdate = (id: string, field: string, value: any) => {
        router.put(QuestionController.update(id).url, {
            [field]: value
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleQuestionDelete = (id: string) => {
        router.delete(QuestionController.destroy(id).url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const InsertQuestionIndicator = ({ order }: { order: number }) => (
        <div className="group relative h-8 -my-4 z-10 flex items-center justify-center cursor-pointer">
            {/* Hover Area Helper - makes it easier to trigger */}
            <div className="absolute inset-0 z-0" />

            {/* Visual Line */}
            <div className="absolute inset-x-0 h-px bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />

            {/* Button */}
            <Link
                href={`${QuestionController.create().url}?question_bank_id=${questionBank.id}&order=${order}`}
                className="relative z-20 bg-background border rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-primary hover:text-primary-foreground pointer-events-auto transform scale-75 group-hover:scale-100 duration-200"
                title="Sisipkan Pertanyaan Disini"
            >
                <Plus className="h-4 w-4" />
            </Link>
        </div>
    );

    return (
        <AppShell variant="header">
            <Head title={`Edit ${questionBank.name}`} />

            {/* Custom Top Bar */}
            <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={QuestionBankController.index().url}>
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>

                <div className="flex-1">
                    <Input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="h-10 text-lg font-semibold border-transparent focus-visible:ring-0 px-0 hover:border-input focus-visible:border-input focus-visible:px-3 transition-all max-w-md"
                        placeholder="Nama Bank Soal"
                    />
                    {errors.name && <div className="text-sm text-red-500 mt-1">{errors.name}</div>}
                </div>

                <Button onClick={submit} disabled={processing || !isDirty}>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6 bg-muted/10">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header for Questions Section */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold tracking-tight">Daftar Pertanyaan ({questions.length})</h2>
                        <Button size="sm" variant="outline" asChild>
                            <Link href={`${QuestionController.create().url}?question_bank_id=${questionBank.id}`}>
                                Tambah Pertanyaan
                            </Link>
                        </Button>
                    </div>

                    {questions.length > 0 ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sortedQuestions.map(q => q.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-4 pl-8"> {/* Add padding-left for drag handle space */}
                                    {sortedQuestions.map((question, index) => (
                                        <div key={question.id}>
                                            <SortableQuestionCard
                                                id={`question-${question.id}`}
                                                question={question}
                                                onUpdate={handleQuestionUpdate}
                                                onDelete={handleQuestionDelete}
                                                onEdit={(q) => router.visit(QuestionController.edit(q.id).url)}
                                            />
                                            <InsertQuestionIndicator order={index + 2} />
                                        </div>
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <Card className="min-h-[300px] flex items-center justify-center border-dashed">
                            <CardContent className="text-center text-muted-foreground">
                                <p>Belum ada pertanyaan di bank soal ini.</p>
                                <Button variant="link" className="mt-2" asChild>
                                    <Link href={`${QuestionController.create().url}?question_bank_id=${questionBank.id}`}>
                                        Buat Pertanyaan Baru
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
