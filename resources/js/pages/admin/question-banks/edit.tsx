import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useDebounce } from 'use-debounce';

// Wayground Imports
import { index } from '@/routes/admin/question-banks';
import QuestionBankController from '@/actions/App/Http/Controllers/Admin/QuestionBankController';

import QuestionCard, { Question } from '@/components/app/questions/QuestionCard';

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

    const handleQuestionUpdate = (id: string, field: string, value: any) => {
        router.put(`/admin/questions/${id}`, {
            [field]: value
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppShell variant="header">
            <Head title={`Edit ${questionBank.name}`} />

            {/* Custom Top Bar */}
            <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={index().url}>
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
                        <Button size="sm" variant="outline">
                            Tambah Pertanyaan
                        </Button>
                    </div>

                    {questions.length > 0 ? (
                        <div className="space-y-4">
                            {questions.map((question) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    onUpdate={handleQuestionUpdate}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="min-h-[300px] flex items-center justify-center border-dashed">
                            <CardContent className="text-center text-muted-foreground">
                                <p>Belum ada pertanyaan di bank soal ini.</p>
                                <Button variant="link" className="mt-2">Buat Pertanyaan Baru</Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
