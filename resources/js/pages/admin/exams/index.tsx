import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Edit, Plus, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';


interface Exam {
    id: string;
    title: string;
    exam_type: string;
    duration: number;
    is_published: boolean;
    is_randomized: boolean;
    passing_score: number;
    start_time: string;
    end_time: string;
    status: string;
    academic_year: { id: string; year: string; };
    grade: { id: string; name: string; };
    subject: { id: string; name: string; };
    teacher: { id: string; name: string; };
    question_bank: { id: string; name: string; };
    token: string;
    is_token_visible: boolean;
}

interface CreateExamForm {
    academic_year_id: string;
    grade_id: string;
    subject_id: string;
    teacher_id: string;
    question_bank_id: string;
    title: string;
    exam_type: string;
    duration: number;
    is_published: boolean;
    is_randomized: boolean;
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
    questionBanks: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Exam Management', href: examsIndexRoute.url() },
];

export default function Index({ exams, academicYears, grades, subjects, teachers, examTypes, questionBanks }: IndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);

    const createForm = useForm<CreateExamForm>({
        academic_year_id: academicYears.find((ay: any) => ay.active)?.id || academicYears[0]?.id || '',
        grade_id: '',
        subject_id: '',
        teacher_id: '',
        question_bank_id: '',
        title: '',
        exam_type: '',
        duration: 60,
        is_published: false,
        is_randomized: true,
        passing_score: 75,
        start_time: '',
        end_time: '',
    });

    const editForm = useForm<CreateExamForm>({
        academic_year_id: '',
        grade_id: '',
        subject_id: '',
        teacher_id: '',
        question_bank_id: '',
        title: '',
        exam_type: '',
        duration: 0,
        is_published: false,
        is_randomized: false,
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
            grade_id: exam.grade?.id || '',
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
        if (!createForm.data.grade_id) return [];
        return subjects.filter((s: any) => s.grade_id === createForm.data.grade_id);
    }, [createForm.data.grade_id, subjects]);

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
    }, [createForm.data.grade_id]);

    useEffect(() => {
        // Find if current question bank is valid for new subject
        const isValid = createFilteredQuestionBanks.find(qb => qb.id === createForm.data.question_bank_id);
        if (!isValid && createForm.data.question_bank_id) {
            createForm.setData('question_bank_id', '');
        }
    }, [createForm.data.subject_id]);


    // --- Chained Select Logic for Edit Form ---
    const editFilteredSubjects = useMemo(() => {
        if (!editForm.data.grade_id) return [];
        return subjects.filter((s: any) => s.grade_id === editForm.data.grade_id);
    }, [editForm.data.grade_id, subjects]);

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
    }, [editForm.data.grade_id]);

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
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl flex items-center gap-2 bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                                <Plus className="size-4" />
                                Create New Exam
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-4xl rounded-3xl border-none shadow-2xl">
                            <form onSubmit={submitCreate}>
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">Create Exam</DialogTitle>
                                    <DialogDescription>Fill in the details to create a new exam.</DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                    {/* Column 1 */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input value={createForm.data.title} onChange={(e) => createForm.setData('title', e.target.value)} placeholder="e.g. Mid-term Physics" />
                                            <InputError message={createForm.errors.title} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Academic Year</Label>
                                                <Select onValueChange={(v) => createForm.setData('academic_year_id', v)} defaultValue={createForm.data.academic_year_id}>
                                                    <SelectTrigger><SelectValue placeholder="Select Academic Year" /></SelectTrigger>
                                                    <SelectContent>{academicYears.map(ay => <SelectItem key={ay.id} value={ay.id}>{ay.year}</SelectItem>)}</SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Grade</Label>
                                                <Select onValueChange={(v) => createForm.setData('grade_id', v)} value={createForm.data.grade_id}>
                                                    <SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger>
                                                    <SelectContent>{grades.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Subject</Label>
                                                <Select onValueChange={(v) => createForm.setData('subject_id', v)} value={createForm.data.subject_id} disabled={!createForm.data.grade_id}>
                                                    <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                                    <SelectContent>
                                                        {createFilteredSubjects.length > 0 ? (
                                                            createFilteredSubjects.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)
                                                        ) : (
                                                            <div className="p-2 text-sm text-muted-foreground">No subjects for this grade</div>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Question Bank</Label>
                                                <Select onValueChange={(v) => createForm.setData('question_bank_id', v)} value={createForm.data.question_bank_id} disabled={!createForm.data.subject_id}>
                                                    <SelectTrigger><SelectValue placeholder="Select Question Bank" /></SelectTrigger>
                                                    <SelectContent>
                                                        {createFilteredQuestionBanks.length > 0 ? (
                                                            createFilteredQuestionBanks.map((qb: any) => <SelectItem key={qb.id} value={qb.id}>{qb.name}</SelectItem>)
                                                        ) : (
                                                            <div className="p-2 text-sm text-muted-foreground">No question banks for this subject</div>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                        </div>
                                        <div className="grid grid-cols-2 gap-4">

                                            <div className="space-y-2">
                                                <Label>Teacher</Label>
                                                <Select onValueChange={(v) => createForm.setData('teacher_id', v)} value={createForm.data.teacher_id}>
                                                    <SelectTrigger><SelectValue placeholder="Select Teacher" /></SelectTrigger>
                                                    <SelectContent>{teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Exam Type</Label>
                                                <Select onValueChange={(v) => createForm.setData('exam_type', v)} value={createForm.data.exam_type}>
                                                    <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                                    <SelectContent>{examTypes.map(et => <SelectItem key={et} value={et}>{et}</SelectItem>)}</SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                    </div>
                                    {/* Column 2 */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
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
                                        <div className="grid grid-cols-2 gap-4">
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
                                        <div className="flex items-center space-x-2 pt-4">
                                            <Checkbox id="is_randomized" checked={createForm.data.is_randomized} onCheckedChange={(c) => createForm.setData('is_randomized', !!c)} />
                                            <label htmlFor="is_randomized">Randomize Questions</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="is_published" checked={createForm.data.is_published} onCheckedChange={(c) => createForm.setData('is_published', !!c)} />
                                            <label htmlFor="is_published">Publish Exam</label>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full" disabled={createForm.processing}>Create Exam</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
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
                                            <td className="px-6 py-4">{exam.grade?.name || 'N/A'}</td>
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
                                                        onClick={() => openEdit(exam)}
                                                    >
                                                        <Edit className="size-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-all font-bold"
                                                        onClick={() => handleDelete(exam.id)}
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

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent key={editingExam?.id} className="sm:max-w-4xl rounded-3xl border-none shadow-2xl">
                    <form onSubmit={submitEdit}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Edit Exam</DialogTitle>
                            <DialogDescription>Update details for {editingExam?.title}.</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            {/* Column 1 */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input value={editForm.data.title} onChange={(e) => editForm.setData('title', e.target.value)} />
                                    <InputError message={editForm.errors.title} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Academic Year</Label>
                                        <Select onValueChange={(v) => editForm.setData('academic_year_id', v)} value={editForm.data.academic_year_id}>
                                            <SelectTrigger><SelectValue placeholder="Select Academic Year" /></SelectTrigger>
                                            <SelectContent>{academicYears.map(ay => <SelectItem key={ay.id} value={ay.id}>{ay.year}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Grade</Label>
                                        <Select onValueChange={(v) => editForm.setData('grade_id', v)} value={editForm.data.grade_id}>
                                            <SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger>
                                            <SelectContent>{grades.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Subject</Label>
                                        <Select onValueChange={(v) => editForm.setData('subject_id', v)} value={editForm.data.subject_id} disabled={!editForm.data.grade_id}>
                                            <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                            <SelectContent>
                                                {editFilteredSubjects.length > 0 ? (
                                                    editFilteredSubjects.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)
                                                ) : (
                                                    <div className="p-2 text-sm text-muted-foreground">No subjects for this grade</div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Question Bank</Label>
                                        <Select onValueChange={(v) => editForm.setData('question_bank_id', v)} value={editForm.data.question_bank_id} disabled={!editForm.data.subject_id}>
                                            <SelectTrigger><SelectValue placeholder="Select Question Bank" /></SelectTrigger>
                                            <SelectContent>
                                                {editFilteredQuestionBanks.length > 0 ? (
                                                    editFilteredQuestionBanks.map((qb: any) => <SelectItem key={qb.id} value={qb.id}>{qb.name}</SelectItem>)
                                                ) : (
                                                    <div className="p-2 text-sm text-muted-foreground">No question banks for this subject</div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">

                                    <div className="space-y-2">
                                        <Label>Teacher</Label>
                                        <Select onValueChange={(v) => editForm.setData('teacher_id', v)} value={editForm.data.teacher_id}>
                                            <SelectTrigger><SelectValue placeholder="Select Teacher" /></SelectTrigger>
                                            <SelectContent>{teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Exam Type</Label>
                                        <Select onValueChange={(v) => editForm.setData('exam_type', v)} value={editForm.data.exam_type}>
                                            <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                            <SelectContent>{examTypes.map(et => <SelectItem key={et} value={et}>{et}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>

                            </div>
                            {/* Column 2 */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Time</Label>
                                        <Input type="datetime-local" value={editForm.data.start_time ? new Date(editForm.data.start_time).toISOString().slice(0, 16) : ''} onChange={(e) => editForm.setData('start_time', e.target.value)} />
                                        <InputError message={editForm.errors.start_time} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Time</Label>
                                        <Input type="datetime-local" value={editForm.data.end_time ? new Date(editForm.data.end_time).toISOString().slice(0, 16) : ''} onChange={(e) => editForm.setData('end_time', e.target.value)} />
                                        <InputError message={editForm.errors.end_time} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Duration (minutes)</Label>
                                        <Input type="number" value={editForm.data.duration} onChange={(e) => editForm.setData('duration', parseInt(e.target.value))} />
                                        <InputError message={editForm.errors.duration} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Passing Score</Label>
                                        <Input type="number" value={editForm.data.passing_score} onChange={(e) => editForm.setData('passing_score', parseInt(e.target.value))} />
                                        <InputError message={editForm.errors.passing_score} />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-4">
                                    <Checkbox id="edit_is_randomized" checked={editForm.data.is_randomized} onCheckedChange={(c) => editForm.setData('is_randomized', !!c)} />
                                    <label htmlFor="edit_is_randomized">Randomize Questions</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="edit_is_published" checked={editForm.data.is_published} onCheckedChange={(c) => editForm.setData('is_published', !!c)} />
                                    <label htmlFor="edit_is_published">Publish Exam</label>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full" disabled={editForm.processing}>Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout >
    );
}