import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Globe, Lock, Plus } from 'lucide-react';
import QuestionBankController from '@/actions/App/Http/Controllers/Admin/QuestionBankController';
import ExamController from '@/actions/App/Http/Controllers/Admin/ExamController';
import QuestionCard from '@/components/app/questions/QuestionCard';
import { Question } from '@/components/app/questions/types';
import 'katex/dist/katex.min.css';

interface QuestionBank {
    id: number;
    name: string;
    subject_id: number;
    description: string | null;
    is_public: boolean;
    subject: {
        id: number;
        name: string;
        grade?: {
            id: number;
            name: string;
        };
    };
    teacher: {
        id: number;
        name: string;
        email: string;
    };
}

interface ShowProps {
    questionBank: QuestionBank;
    questions: Question[];
}

export default function Show({ questionBank, questions }: ShowProps) {
    return (
        <AppShell variant="header">
            <Head title={questionBank.name} />

            {/* Header Bar */}
            <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={QuestionBankController.index().url}>
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>

                <div className="flex-1">
                    <h1 className="text-lg font-semibold">{questionBank.name}</h1>
                </div>

                <Button variant="outline" size="sm" asChild>
                    <Link href={QuestionBankController.edit(questionBank.id).url}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Link>
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6 bg-muted/10">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Card 1: Informasi Question Bank */}
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                            <div className="space-y-1 flex-1">
                                <CardTitle className="text-2xl font-bold">Informasi Bank Soal</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Detail dan informasi terkait bank soal ini
                                </p>
                            </div>
                            <Button asChild>
                                <Link
                                    href={`${ExamController.create().url}?question_bank_id=${questionBank.id}&title=${encodeURIComponent(questionBank.name)}`}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Buat Exam dari Bank Soal
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">Nama</div>
                                    <div className="text-base font-semibold">{questionBank.name}</div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">Mata Pelajaran</div>
                                    <div className="text-base">
                                        {questionBank.subject.name}
                                        {questionBank.subject.grade && (
                                            <span className="text-muted-foreground"> - {questionBank.subject.grade.name}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">Pembuat</div>
                                    <div className="text-base">
                                        <div className="font-medium">{questionBank.teacher.name}</div>
                                        <div className="text-sm text-muted-foreground">{questionBank.teacher.email}</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">Status</div>
                                    <div>
                                        {questionBank.is_public ? (
                                            <Badge variant="outline" className="gap-1">
                                                <Globe className="h-3 w-3" />
                                                Publik
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="gap-1">
                                                <Lock className="h-3 w-3" />
                                                Privat
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {questionBank.description && (
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">Deskripsi</div>
                                    <div className="text-base text-muted-foreground bg-muted/50 rounded-md p-4">
                                        {questionBank.description}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Card 2: Daftar Pertanyaan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">
                                Daftar Pertanyaan ({questions.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {questions.length > 0 ? (
                                <div className="space-y-4">
                                    {questions.map((question, index) => (
                                        <div key={question.id} className="relative">
                                            {/* Question Number Badge */}
                                            <div className="absolute -left-3 top-4 z-10">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-md">
                                                    {index + 1}
                                                </div>
                                            </div>

                                            {/* Question Card */}
                                            <div className="ml-6">
                                                <QuestionCard
                                                    question={question}
                                                    readOnly={true}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-12">
                                    <p>Belum ada pertanyaan di bank soal ini.</p>
                                    <Button variant="link" className="mt-2" asChild>
                                        <Link href={QuestionBankController.edit(questionBank.id).url}>
                                            Tambah Pertanyaan
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
