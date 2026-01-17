import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Edit, Globe, Lock, Plus, Lightbulb, MoreHorizontal, Calendar, User, BookOpen } from 'lucide-react';
import QuestionBankController from '@/actions/App/Http/Controllers/Admin/QuestionBankController';
import ExamController from '@/actions/App/Http/Controllers/Admin/ExamController';
import QuestionCard from '@/components/app/questions/QuestionCard';
import { Question } from '@/components/app/questions/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';
import InputError from '@/components/input-error';
import { useState, useEffect, useMemo } from 'react';
import { TimerTypeSelector } from '@/components/app/timer-type-selector';
import 'katex/dist/katex.min.css';
import QuestionSuggestionSidebar from '@/components/app/questions/QuestionSuggestionSidebar';
import QuestionNavigation from '@/components/app/questions/QuestionNavigation';
import SuggestionInlineCard from '@/components/app/questions/SuggestionInlineCard';
import { Separator } from '@/components/ui/separator';

interface QuestionBank {
    id: number;
    user_id: string;
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
    suggestions?: any[];
    auth: {
        user: {
            id: string;
            name: string;
        }
    }
}

interface CreateExamFormData {
    academic_year_id: string;
    grade_ids: string[];
    subject_id: string;
    teacher_id: string;
    question_bank_id: string;
    title: string;
    exam_type: string;
    duration: number;
    is_published: boolean;
    is_randomized: boolean;
    is_answer_randomized: boolean;
    is_hint_visible: boolean;
    show_result_on_finish: boolean;
    max_attempts: number | null;
    timer_type: string;
    passing_score: number;
    start_time: string;
    end_time: string;
}

export default function Show({ questionBank, questions, suggestions = [], auth }: ShowProps) {
    const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Suggestion State
    const [selectedQuestionForSuggestion, setSelectedQuestionForSuggestion] = useState<Question | null>(null);
    const [isSuggestionSidebarOpen, setIsSuggestionSidebarOpen] = useState(false);

    // Helper untuk format datetime-local input
    const getDefaultStartTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    };

    const getDefaultEndTime = () => {
        const now = new Date();
        now.setDate(now.getDate() + 1); // 24 jam dari sekarang
        return now.toISOString().slice(0, 16);
    };

    const createForm = useForm<CreateExamFormData>({
        academic_year_id: '',
        grade_ids: questionBank.subject.grade?.id ? [questionBank.subject.grade.id.toString()] : [],
        subject_id: questionBank.subject_id.toString(),
        teacher_id: questionBank.teacher.id.toString(),
        question_bank_id: questionBank.id.toString(),
        title: questionBank.name,
        exam_type: 'daily',
        duration: 60,
        is_published: true, // Default true
        is_randomized: true,
        is_answer_randomized: false,
        is_hint_visible: false,
        show_result_on_finish: true,
        max_attempts: null,
        timer_type: 'flexible',
        passing_score: 70, // Default 70
        start_time: getDefaultStartTime(),
        end_time: getDefaultEndTime(),
    });

    const loadFormData = async () => {
        setLoading(true);
        try {
            const response = await fetch(ExamController.create.url());
            const data = await response.json();
            setFormData(data);

            const activeAcademicYear = data.academicYears.find((ay: any) => ay.is_active);
            if (activeAcademicYear) {
                createForm.setData('academic_year_id', activeAcademicYear.id.toString());
            }
        } catch (error) {
            console.error('Failed to load form data:', error);
        } finally {
            setLoading(false);
        }
    };

    const setQuickDuration = (days: number) => {
        const startTime = new Date(createForm.data.start_time);
        const endTime = new Date(startTime);
        endTime.setDate(endTime.getDate() + days);
        createForm.setData('end_time', endTime.toISOString().slice(0, 16));
    };

    const handleOpenCreateExam = () => {
        setIsCreateExamOpen(true);
        if (!formData) {
            loadFormData();
        }
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(ExamController.store.url(), {
            onSuccess: (page: any) => {
                setIsCreateExamOpen(false);
                createForm.reset();
                const examId = page.props.exam?.id;
                if (examId) {
                    router.visit(ExamController.monitor(examId).url);
                } else {
                    router.visit(ExamController.index().url);
                }
            },
        });
    };

    // Check ownership
    const isOwner = auth?.user?.id == questionBank.user_id;

    const handleSuggestClick = (question: Question) => {
        setSelectedQuestionForSuggestion(question);
        setIsSuggestionSidebarOpen(true);
    };

    const scrollToQuestion = (index: number) => {
        const element = document.getElementById(`question-${index}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Map suggestions to questions for easier rendering
    const getSuggestionForQuestion = (questionId: string) => {
        if (isOwner) {
            return suggestions.find(s => s.question_id === questionId && s.state === 'pending');
        }
        return suggestions.find(s => s.question_id === questionId && s.state === 'pending' && s.user_id == auth.user.id);
    };

    return (
        <AppShell variant="header">
            <Head title={questionBank.name} />

            {/* Content Container */}
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-20">
                {/* Simplified Header */}
                <div className="bg-background border-b sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
                    <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <Button variant="ghost" size="icon" className="shrink-0" asChild>
                                <Link href={QuestionBankController.index().url}>
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                            </Button>

                            <div className="flex flex-col overflow-hidden">
                                <h1 className="text-lg font-bold truncate">{questionBank.name}</h1>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {questionBank.subject.name}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {questionBank.teacher.name}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        {questionBank.is_public ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                        {questionBank.is_public ? 'Publik' : 'Privat'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button size="sm" onClick={handleOpenCreateExam} className="hidden sm:flex">
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Exam
                            </Button>
                            {isOwner && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={QuestionBankController.edit(questionBank.id).url}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Soal
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Questions List */}
                        <div className="lg:col-span-10 space-y-12">
                            {questions.length > 0 ? (
                                questions.map((question, index) => {
                                    const suggestion = getSuggestionForQuestion(question.id);

                                    return (
                                        <div
                                            key={question.id}
                                            id={`question-${index}`}
                                            className="scroll-mt-24 relative group"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-sm border border-primary/20">
                                                    {index + 1}
                                                </div>
                                                <Separator className="flex-1" />
                                            </div>

                                            {/* Layout: Suggestion (Left) - Question (Right) if suggestion exists */}
                                            {suggestion && (isOwner || auth.user.id == suggestion.user_id) ? (
                                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                                                    <div className="xl:col-span-8 2xl:col-span-9">
                                                        <QuestionCard
                                                            question={question}
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                    <div className="xl:col-span-4 2xl:col-span-3">
                                                        <div className="sticky top-24">
                                                            <SuggestionInlineCard
                                                                suggestion={suggestion}
                                                                isOwner={isOwner}
                                                                currentUserId={auth.user.id}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <QuestionCard
                                                        question={question}
                                                        readOnly={true}
                                                    />
                                                    {/* Suggest Button for Non-Owners */}
                                                    {!isOwner && questionBank.is_public && (
                                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                className="shadow-sm border bg-background/95 hover:bg-background backdrop-blur"
                                                                onClick={() => handleSuggestClick(question)}
                                                            >
                                                                <Lightbulb className="w-4 h-4 mr-2 text-amber-500" />
                                                                Saran Perubahan
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
                                    <h3 className="text-lg font-medium text-muted-foreground">Belum ada pertanyaan</h3>
                                    <p className="text-sm text-muted-foreground mt-1 mb-4">Mulai tambahkan pertanyaan ke bank soal ini.</p>
                                    {isOwner && (
                                        <Button asChild>
                                            <Link href={QuestionBankController.edit(questionBank.id).url}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Tambah Pertanyaan
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Navigation Sidebar */}
                        <div className="lg:col-span-2 hidden lg:block">
                            <QuestionNavigation
                                totalQuestions={questions.length}
                                onQuestionClick={scrollToQuestion}
                                onScrollToTop={scrollToTop}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Suggestion Sidebar */}
            {selectedQuestionForSuggestion && (
                <QuestionSuggestionSidebar
                    open={isSuggestionSidebarOpen}
                    onOpenChange={setIsSuggestionSidebarOpen}
                    question={selectedQuestionForSuggestion}
                />
            )}

            {/* Create Exam Modal */}
            <Dialog open={isCreateExamOpen} onOpenChange={setIsCreateExamOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <form onSubmit={submitCreate}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Buat Exam Baru</DialogTitle>
                            <DialogDescription>
                                Buat exam baru dari bank soal "{questionBank.name}"
                            </DialogDescription>
                        </DialogHeader>

                        {loading ? (
                            <div className="py-6 text-center text-muted-foreground">Loading...</div>
                        ) : formData ? (
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Judul Exam</Label>
                                    <Input
                                        value={createForm.data.title}
                                        onChange={(e) => createForm.setData('title', e.target.value)}
                                        placeholder="Nama exam..."
                                    />
                                    <InputError message={createForm.errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Kelas</Label>
                                    <MultiSelect
                                        options={formData.grades.map((grade: any) => ({
                                            label: grade.name,
                                            value: grade.id.toString()
                                        }))}
                                        value={createForm.data.grade_ids}
                                        onChange={(v) => createForm.setData('grade_ids', v)}
                                        placeholder="Pilih Kelas"
                                    />
                                    <InputError message={createForm.errors.grade_ids} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Tahun Ajaran</Label>
                                        <Select
                                            value={createForm.data.academic_year_id}
                                            onValueChange={(v) => createForm.setData('academic_year_id', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Tahun Ajaran" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {formData.academicYears.map((ay: any) => (
                                                    <SelectItem key={ay.id} value={ay.id.toString()}>
                                                        {ay.year} {ay.is_active && '(Aktif)'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={createForm.errors.academic_year_id} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Tipe Exam</Label>
                                        <Select
                                            value={createForm.data.exam_type}
                                            onValueChange={(v) => createForm.setData('exam_type', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Tipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {formData.examTypes.map((et: string) => (
                                                    <SelectItem key={et} value={et}>
                                                        {et}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={createForm.errors.exam_type} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Waktu Mulai</Label>
                                        <Input
                                            type="datetime-local"
                                            value={createForm.data.start_time}
                                            onChange={(e) => createForm.setData('start_time', e.target.value)}
                                        />
                                        <InputError message={createForm.errors.start_time} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Waktu Selesai</Label>
                                        <Input
                                            type="datetime-local"
                                            value={createForm.data.end_time}
                                            onChange={(e) => createForm.setData('end_time', e.target.value)}
                                        />
                                        <InputError message={createForm.errors.end_time} />
                                    </div>
                                </div>

                                {/* Quick Duration Buttons */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Durasi Cepat (dari waktu mulai)</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuickDuration(1)}
                                        >
                                            1 Hari
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuickDuration(3)}
                                        >
                                            3 Hari
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuickDuration(7)}
                                        >
                                            1 Minggu
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuickDuration(14)}
                                        >
                                            2 Minggu
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Durasi (menit)</Label>
                                        <Input
                                            type="number"
                                            value={createForm.data.duration}
                                            onChange={(e) => createForm.setData('duration', parseInt(e.target.value))}
                                        />
                                        <InputError message={createForm.errors.duration} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Passing Score (%)</Label>
                                        <Input
                                            type="number"
                                            value={createForm.data.passing_score}
                                            onChange={(e) => createForm.setData('passing_score', parseInt(e.target.value))}
                                        />
                                        <InputError message={createForm.errors.passing_score} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_randomized"
                                            checked={createForm.data.is_randomized}
                                            onCheckedChange={(c) => createForm.setData('is_randomized', !!c)}
                                        />
                                        <label
                                            htmlFor="is_randomized"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Acak Urutan Soal
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_answer_randomized"
                                            checked={createForm.data.is_answer_randomized}
                                            onCheckedChange={(c) => createForm.setData('is_answer_randomized', !!c)}
                                        />
                                        <label
                                            htmlFor="is_answer_randomized"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Acak Urutan Jawaban
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="show_result_on_finish"
                                            checked={createForm.data.show_result_on_finish}
                                            onCheckedChange={(c) => createForm.setData('show_result_on_finish', !!c)}
                                        />
                                        <label
                                            htmlFor="show_result_on_finish"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Tampilkan Nilai Diahir
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_hint_visible"
                                            checked={createForm.data.is_hint_visible}
                                            onCheckedChange={(c) => createForm.setData('is_hint_visible', !!c)}
                                        />
                                        <label
                                            htmlFor="is_hint_visible"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Tampilkan Hint/Bantuan
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_published"
                                            checked={createForm.data.is_published}
                                            onCheckedChange={(c) => createForm.setData('is_published', !!c)}
                                        />
                                        <label
                                            htmlFor="is_published"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Publish Exam
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Max Attempts (kosongkan untuk unlimited)</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={createForm.data.max_attempts || ''}
                                        onChange={(e) => createForm.setData('max_attempts', e.target.value ? parseInt(e.target.value) : null)}
                                        placeholder="Unlimited"
                                    />
                                    <InputError message={createForm.errors.max_attempts} />
                                </div>

                                <TimerTypeSelector
                                    value={createForm.data.timer_type}
                                    onValueChange={(v) => createForm.setData('timer_type', v)}
                                    timerTypes={formData?.timerTypes}
                                    error={createForm.errors.timer_type}
                                />

                                {/* Read-only fields */}
                                <div className="border-t pt-4 space-y-2">
                                    <div className="text-sm text-muted-foreground">
                                        <strong>Mata Pelajaran:</strong> {questionBank.subject.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <strong>Guru:</strong> {questionBank.teacher.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <strong>Bank Soal:</strong> {questionBank.name}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-6 text-center text-muted-foreground">
                                Gagal memuat data form
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateExamOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={createForm.processing || loading}>
                                {createForm.processing ? 'Menyimpan...' : 'Buat Exam'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppShell>
    );
}

