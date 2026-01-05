import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Edit, Plus, Trash2, Eye, EyeOff, RefreshCw, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useMemo } from 'react';
import InputError from '@/components/input-error';
import Pagination from '@/components/Pagination';
import { dashboard } from '@/routes';
import ExamController from '@/actions/App/Http/Controllers/Admin/ExamController';
import { index as examsIndexRoute } from '@/routes/admin/exams';
// @ts-ignore
const route = window.route;
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { TimerTypeSelector } from '@/components/app/timer-type-selector';
import { MultiSelect } from '@/components/ui/multi-select';


interface Exam {
    id: string;
    title: string;
    exam_type: string;
    duration: number;
    is_published: boolean;
    is_randomized: boolean;
    is_answer_randomized: boolean;
    max_attempts: number | null;
    timer_type: string;
    passing_score: number;
    start_time: string;
    end_time: string;
    status: string;
    academic_year: { id: string; year: string; };
    grades: { id: string; name: string; }[];
    subject: { id: string; name: string; };
    teacher: { id: string; name: string; };
    question_bank: { id: string; name: string; };
    token: string;
    is_token_visible: boolean;
    is_hint_visible: boolean;
    show_result_on_finish: boolean;
}

interface CreateExamForm {
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
    is_hint_visible: boolean; // Added
    show_result_on_finish: boolean; // Added
    max_attempts: number | null;
    timer_type: string;
    passing_score: number;
    start_time: string;
    end_time: string;
}

interface IndexProps {
    exams: {
        data: Exam[];
        links: any[];
    };
    academicYears: any[];
    grades: any[];
    subjects: any[];
    teachers: any[];
    examTypes: string[];
    timerTypes: Array<{ value: string, label: string, description: string }>;
    questionBanks: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Exam Management', href: examsIndexRoute.url() },
];

export default function Index({ exams, academicYears, grades, subjects, teachers, examTypes, timerTypes, questionBanks }: IndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);

    const createForm = useForm<CreateExamForm>({
        academic_year_id: academicYears.find((ay: any) => ay.active)?.id || academicYears[0]?.id || '',
        grade_ids: [],
        subject_id: '',
        teacher_id: '',
        question_bank_id: '',
        title: '',
        exam_type: '',
        duration: 60,
        is_published: false,
        is_randomized: true,
        is_answer_randomized: false,
        is_hint_visible: false,
        show_result_on_finish: true,
        max_attempts: null,
        timer_type: 'flexible',
        passing_score: 75,
        start_time: '',
        end_time: '',
    });

    const editForm = useForm<CreateExamForm>({
        academic_year_id: '',
        grade_ids: [],
        subject_id: '',
        teacher_id: '',
        question_bank_id: '',
        title: '',
        exam_type: '',
        duration: 0,
        is_published: false,
        is_randomized: false,
        is_answer_randomized: false,
        max_attempts: null,
        timer_type: 'flexible',
        passing_score: 0,
        start_time: '',
        end_time: '',
    });

    const deleteForm = useForm();

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(ExamController.store.url(), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (exam: Exam) => {
        console.log('Editing exam:', exam);
        setEditingExam(exam);
        editForm.setData({
            ...exam,
            academic_year_id: exam.academic_year?.id || '',
            grade_ids: exam.grades?.map((g: any) => g.id) || [],
            subject_id: exam.subject?.id || '',
            teacher_id: exam.teacher?.id || '',
            question_bank_id: exam.question_bank?.id || '',
        });
        setIsEditOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingExam) return;
        editForm.put(ExamController.update({ exam: editingExam.id }).url, {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
            },
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this exam?')) {
            deleteForm.delete(ExamController.destroy({ exam: id }).url);
        }
    };

    const handleRegenerateToken = (id: string) => {
        if (confirm('Are you sure you want to regenerate the token? The old token will be invalid.')) {
            router.put(`/admin/exams/${id}/regenerate-token`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleToggleVisibility = (id: string) => {
        router.put(`/admin/exams/${id}/toggle-token-visibility`, {}, {
            preserveScroll: true,
        });
    };

    // --- Chained Select Logic for Create Form ---
    const createFilteredSubjects = useMemo(() => {
        // Allow subjects if ANY of the selected grades match (or simplistic approach: show all if grade selected, or check intersection)
        // With Many-to-Many, subject usually belongs to ONE grade.
        // So we should show subjects that belong to ANY of the selected grades.
        if (createForm.data.grade_ids.length === 0) return [];
        return subjects.filter((s: any) => createForm.data.grade_ids.includes(s.grade_id));
    }, [createForm.data.grade_ids, subjects]);

    const createFilteredQuestionBanks = useMemo(() => {
        if (!createForm.data.subject_id) return [];
        return questionBanks.filter((qb: any) => qb.subject_id === createForm.data.subject_id);
    }, [createForm.data.subject_id, questionBanks]);

    // Reset dependent fields when parent fields change
    useEffect(() => {
        // Find if current subject is valid for new grade
        const isValid = createFilteredSubjects.find(s => s.id === createForm.data.subject_id);
        if (!isValid && createForm.data.subject_id) {
            createForm.setData('subject_id', '');
        }
    }, [createForm.data.grade_ids]);

    useEffect(() => {
        // Find if current question bank is valid for new subject
        const isValid = createFilteredQuestionBanks.find(qb => qb.id === createForm.data.question_bank_id);
        if (!isValid && createForm.data.question_bank_id) {
            createForm.setData('question_bank_id', '');
        }
    }, [createForm.data.subject_id]);


    // --- Chained Select Logic for Edit Form ---
    const editFilteredSubjects = useMemo(() => {
        if (editForm.data.grade_ids.length === 0) return [];
        return subjects.filter((s: any) => editForm.data.grade_ids.includes(s.grade_id));
    }, [editForm.data.grade_ids, subjects]);

    const editFilteredQuestionBanks = useMemo(() => {
        if (!editForm.data.subject_id) return [];
        return questionBanks.filter((qb: any) => qb.subject_id === editForm.data.subject_id);
    }, [editForm.data.subject_id, questionBanks]);

    useEffect(() => {
        // Only reset if we are interacting (to avoid resetting on initial load)
        // However, form reset handled by openEdit somewhat. 
        // Here we need to be careful not to wipe data when opening modal.
        // But since we set data first, then open modal, these effects might run.
        // Let's assume user interaction triggers changes.
        // Actually, simple way: check if current selected matches filtered.
        const currentId = editForm.data.subject_id;
        if (currentId && !editFilteredSubjects.find(s => s.id === currentId)) {
            editForm.setData('subject_id', '');
        }
    }, [editForm.data.grade_ids]);

    useEffect(() => {
        const currentId = editForm.data.question_bank_id;
        if (currentId && !editFilteredQuestionBanks.find(qb => qb.id === currentId)) {
            editForm.setData('question_bank_id', '');
        }
    }, [editForm.data.subject_id]);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exam Management" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Exam Management</h1>
                        <p className="text-muted-foreground font-medium">Manage exams, schedules, and settings.</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Exam
                    </Button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-muted-foreground dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Token</th>
                                    <th className="px-6 py-4">Subject</th>
                                    <th className="px-6 py-4">Grade</th>
                                    <th className="px-6 py-4">Teacher</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {exams.data.length > 0 ? (
                                    exams.data.map((exam: Exam) => (
                                        <tr key={exam.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 dark:text-slate-100">{exam.title}</div>
                                                <div className="text-xs text-muted-foreground">{exam.exam_type}</div>
                                                <br />
                                                <div className="text-xs text-muted-foreground">{exam.question_bank?.name || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <code className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-sm font-mono tracking-wider">
                                                        {exam.token}
                                                    </code>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className={cn(
                                                                "h-6 w-6 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800",
                                                                exam.is_token_visible ? "text-blue-600" : "text-slate-400"
                                                            )}
                                                            onClick={() => handleToggleVisibility(exam.id)}
                                                            title={exam.is_token_visible ? "Visible to Students" : "Hidden from Students"}
                                                        >
                                                            {exam.is_token_visible ? (
                                                                <Eye className="size-3" />
                                                            ) : (
                                                                <EyeOff className="size-3" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-6 w-6 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                                                            onClick={() => handleRegenerateToken(exam.id)}
                                                            title="Regenerate Token"
                                                        >
                                                            <RefreshCw className="size-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{exam.subject?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {exam.grades?.map((g) => (
                                                        <Badge key={g.id} variant="secondary" className="text-xs">
                                                            {g.name}
                                                        </Badge>
                                                    )) || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{exam.teacher?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">{exam.duration} mins</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={exam.status === 'ongoing' ? 'default' : exam.status === 'finished' ? 'destructive' : 'secondary'}>
                                                    {exam.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-all font-bold"
                                                        onClick={() => router.visit(ExamController.monitor(exam.id).url)}
                                                        title="Monitor Exam"
                                                    >
                                                        <Monitor className="size-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/30 transition-all font-bold"
                                                        onClick={() => router.visit(ExamController.edit(exam.id).url)}
                                                        title="Edit Exam"
                                                    >
                                                        <Edit className="size-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-all font-bold"
                                                        onClick={() => handleDelete(exam.id)}
                                                        title="Delete Exam"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                                            No exams found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination links={exams.links} />
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Exam</DialogTitle>
                        <DialogDescription>
                            Create a new exam. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={createForm.data.title} onChange={(e) => createForm.setData('title', e.target.value)} placeholder="e.g. UTS Matematika" />
                                <InputError message={createForm.errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label>Exam Type</Label>
                                <Select onValueChange={(v) => createForm.setData('exam_type', v)} value={createForm.data.exam_type}>
                                    <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                    <SelectContent>{examTypes.map(et => <SelectItem key={et} value={et}>{et}</SelectItem>)}</SelectContent>
                                </Select>
                                <InputError message={createForm.errors.exam_type} />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Academic Year</Label>
                                <Select onValueChange={(v) => createForm.setData('academic_year_id', v)} value={createForm.data.academic_year_id}>
                                    <SelectTrigger><SelectValue placeholder="Select Academic Year" /></SelectTrigger>
                                    <SelectContent>
                                        {academicYears.map((ay: any) => (
                                            <SelectItem key={ay.id} value={ay.id}>{ay.year}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={createForm.errors.academic_year_id} />
                            </div>
                            <div className="space-y-2">
                                <Label>Teacher</Label>
                                <Select onValueChange={(v) => createForm.setData('teacher_id', v)} value={createForm.data.teacher_id}>
                                    <SelectTrigger><SelectValue placeholder="Select Teacher" /></SelectTrigger>
                                    <SelectContent>
                                        {teachers.map((t: any) => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={createForm.errors.teacher_id} />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Grade</Label>
                                <MultiSelect
                                    options={grades.map((g: any) => ({ label: g.name, value: g.id }))}
                                    value={createForm.data.grade_ids}
                                    onChange={(v) => createForm.setData('grade_ids', v)}
                                    placeholder="Select Grades"
                                />
                                <InputError message={createForm.errors.grade_ids} />
                            </div>
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Select onValueChange={(v) => createForm.setData('subject_id', v)} value={createForm.data.subject_id} disabled={!createForm.data.grade_ids.length}>
                                    <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                    <SelectContent>
                                        {createFilteredSubjects.map((s: any) => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={createForm.errors.subject_id} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Question Bank</Label>
                            <Select onValueChange={(v) => createForm.setData('question_bank_id', v)} value={createForm.data.question_bank_id} disabled={!createForm.data.subject_id}>
                                <SelectTrigger><SelectValue placeholder="Select Question Bank" /></SelectTrigger>
                                <SelectContent>
                                    {createFilteredQuestionBanks.map((qb: any) => (
                                        <SelectItem key={qb.id} value={qb.id}>{qb.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.question_bank_id} />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Start Time</Label>
                                <Input type="datetime-local" value={createForm.data.start_time} onChange={(e) => createForm.setData('start_time', e.target.value)} />
                                <InputError message={createForm.errors.start_time} />
                            </div>
                            <div className="space-y-2">
                                <Label>End Time</Label>
                                <Input type="datetime-local" value={createForm.data.end_time} onChange={(e) => createForm.setData('end_time', e.target.value)} />
                                <InputError message={createForm.errors.end_time} />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Duration (minutes)</Label>
                                <Input type="number" value={createForm.data.duration} onChange={(e) => createForm.setData('duration', parseInt(e.target.value))} />
                                <InputError message={createForm.errors.duration} />
                            </div>
                            <div className="space-y-2">
                                <Label>Passing Score</Label>
                                <Input type="number" value={createForm.data.passing_score} onChange={(e) => createForm.setData('passing_score', parseInt(e.target.value))} />
                                <InputError message={createForm.errors.passing_score} />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Max Attempts (Empty for unlimited)</Label>
                                <Input type="number" min="1" value={createForm.data.max_attempts || ''} onChange={(e) => createForm.setData('max_attempts', e.target.value ? parseInt(e.target.value) : null)} />
                                <InputError message={createForm.errors.max_attempts} />
                            </div>

                            <TimerTypeSelector
                                value={createForm.data.timer_type}
                                onValueChange={(v) => createForm.setData('timer_type', v)}
                                timerTypes={timerTypes}
                                error={createForm.errors.timer_type}
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="create_is_randomized" checked={createForm.data.is_randomized} onCheckedChange={(c) => createForm.setData('is_randomized', !!c)} />
                                <label htmlFor="create_is_randomized" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Randomize Questions</label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="create_is_answer_randomized" checked={createForm.data.is_answer_randomized} onCheckedChange={(c) => createForm.setData('is_answer_randomized', !!c)} />
                                <label htmlFor="create_is_answer_randomized" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Randomize Answer Options</label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="create_show_result_on_finish" checked={createForm.data.show_result_on_finish} onCheckedChange={(c) => createForm.setData('show_result_on_finish', !!c)} />
                                <label htmlFor="create_show_result_on_finish" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Show Result on Finish</label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="create_is_published" checked={createForm.data.is_published} onCheckedChange={(c) => createForm.setData('is_published', !!c)} />
                                <label htmlFor="create_is_published" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Publish Exam</label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="create_is_hint_visible" checked={createForm.data.is_hint_visible} onCheckedChange={(c) => createForm.setData('is_hint_visible', !!c)} />
                                <label htmlFor="create_is_hint_visible" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Show Hints to Students</label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={createForm.processing}>Create Exam</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout >
    );
}