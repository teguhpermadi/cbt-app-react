import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { BookOpen, Edit, Plus, Trash2 } from 'lucide-react';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';
import InputError from '@/components/input-error';
import Pagination from '@/components/Pagination';
import SubjectController from '@/actions/App/Http/Controllers/Admin/SubjectController';
import { index } from '@/routes/admin/subjects';
import { dashboard } from '@/routes';

interface Subject {
    id: string;
    name: string;
    code: string | null;
    description: string | null;
    grade: {
        id: string;
        name: string;
    };
    academicYear: {
        id: string;
        year: string;
    };
}

interface CreateSubjectForm {
    name: string;
    code: string;
    description: string;
    grade_id: string;
    academic_year_id: string;
}

interface EditSubjectForm {
    name: string;
    code: string;
    description: string;
    grade_id: string;
    academic_year_id: string;
}

interface IndexProps {
    subjects: {
        data: Subject[];
        links: any[];
    };
    grades: any[];
    academicYears: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Subject Management', href: index().url },
];

export default function Index({ subjects, grades, academicYears }: IndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<any>(null);

    const createForm = useForm<CreateSubjectForm>({
        name: '',
        code: '',
        description: '',
        grade_id: '',
        academic_year_id: academicYears.find((ay: any) => ay.active)?.id || academicYears[0]?.id || '',
    });

    const editForm = useForm<EditSubjectForm>({
        name: '',
        code: '',
        description: '',
        grade_id: '',
        academic_year_id: '',
    });

    const deleteForm = useForm();

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(SubjectController.store.url(), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (subject: any) => {
        setEditingSubject(subject);
        editForm.setData({
            name: subject.name,
            code: subject.code || '',
            description: subject.description || '',
            grade_id: subject.grade?.id || '',
            academic_year_id: subject.academicYear?.id || '',
        });
        setIsEditOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSubject) return;
        editForm.put(SubjectController.update(editingSubject?.id).url, {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
            },
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this subject?')) {
            deleteForm.delete(SubjectController.destroy(id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subject Management" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Subject Management</h1>
                        <p className="text-muted-foreground font-medium">Manage subjects and course details.</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl flex items-center gap-2 bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                                <Plus className="size-4" />
                                Enroll New Subject
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl">
                            <form onSubmit={submitCreate}>
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">Enroll Subject</DialogTitle>
                                    <DialogDescription>Create a new subject for the curriculum.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="sub-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject Name</Label>
                                            <Input id="sub-name" value={createForm.data.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => createForm.setData('name', e.target.value)} placeholder="Mathematics" className="rounded-xl h-11 border-slate-200" />
                                            <InputError message={createForm.errors.name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="sub-code" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Code</Label>
                                            <Input id="sub-code" value={createForm.data.code} onChange={(e: React.ChangeEvent<HTMLInputElement>) => createForm.setData('code', e.target.value)} placeholder="MTH101" className="rounded-xl h-11 border-slate-200" />
                                            <InputError message={createForm.errors.code} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sub-desc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                                        <Textarea id="sub-desc" value={createForm.data.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => createForm.setData('description', e.target.value)} placeholder="Subject description..." className="rounded-xl border-slate-200 resize-none" />
                                        <InputError message={createForm.errors.description} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Grade</Label>
                                            <Select onValueChange={(val) => createForm.setData('grade_id', val)}>
                                                <SelectTrigger className="rounded-xl h-11 border-slate-200">
                                                    <SelectValue placeholder="Grade" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-none shadow-xl">
                                                    {grades.filter(Boolean).map(g => (
                                                        <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={createForm.errors.grade_id} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Academic Year</Label>
                                            <Select onValueChange={(val) => createForm.setData('academic_year_id', val)} defaultValue={createForm.data.academic_year_id}>
                                                <SelectTrigger className="rounded-xl h-11 border-slate-200">
                                                    <SelectValue placeholder="Year" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-none shadow-xl">
                                                    {academicYears.filter(Boolean).map(ay => (
                                                        <SelectItem key={ay.id} value={ay.id}>{ay.year} {ay.active ? '(Active)' : ''}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={createForm.errors.academic_year_id} />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full rounded-xl h-11 bg-primary font-bold shadow-lg shadow-primary/20" disabled={createForm.processing}>
                                        Enroll Subject
                                    </Button>
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
                                    <th className="px-6 py-4">Subject Info</th>
                                    <th className="px-6 py-4">Grade</th>
                                    <th className="px-6 py-4">Academic Year</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {subjects.data.length > 0 ? (
                                    subjects.data.map((subject: any) => (
                                        <tr key={subject.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 dark:text-slate-100">{subject.name}</span>
                                                        {subject.code && (
                                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-mono">
                                                                {subject.code}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {subject.description && (
                                                        <span className="text-xs text-muted-foreground font-medium truncate max-w-[200px]">{subject.description}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="rounded-lg px-2.5 py-1 flex w-fit items-center gap-1.5 font-bold text-blue-600 bg-blue-50/50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50 uppercase tracking-tighter text-[10px]">
                                                    <BookOpen className="size-3.5" />
                                                    {subject.grade?.name || 'N/A'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {subject.academicYear?.year || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-all font-bold"
                                                        onClick={() => openEdit(subject)}
                                                    >
                                                        <Edit className="size-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-all font-bold"
                                                        onClick={() => handleDelete(subject.id)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                            No subjects found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination links={subjects.links} />
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl">
                    <form onSubmit={submitEdit}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Edit Subject</DialogTitle>
                            <DialogDescription>Update details for {editingSubject?.name}.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-sub-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject Name</Label>
                                    <Input id="edit-sub-name" value={editForm.data.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => editForm.setData('name', e.target.value)} className="rounded-xl h-11 border-slate-200" />
                                    <InputError message={editForm.errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-sub-code" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Code</Label>
                                    <Input id="edit-sub-code" value={editForm.data.code} onChange={(e: React.ChangeEvent<HTMLInputElement>) => editForm.setData('code', e.target.value)} className="rounded-xl h-11 border-slate-200" />
                                    <InputError message={editForm.errors.code} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-sub-desc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                                <Textarea id="edit-sub-desc" value={editForm.data.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => editForm.setData('description', e.target.value)} className="rounded-xl border-slate-200 resize-none" />
                                <InputError message={editForm.errors.description} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Grade</Label>
                                    <Select onValueChange={(val) => editForm.setData('grade_id', val)} defaultValue={editForm.data.grade_id}>
                                        <SelectTrigger className="rounded-xl h-11 border-slate-200">
                                            <SelectValue placeholder="Grade" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-none shadow-xl">
                                            {grades.filter(Boolean).map(g => (
                                                <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={editForm.errors.grade_id} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Academic Year</Label>
                                    <Select onValueChange={(val) => editForm.setData('academic_year_id', val)} defaultValue={editForm.data.academic_year_id}>
                                        <SelectTrigger className="rounded-xl h-11 border-slate-200">
                                            <SelectValue placeholder="Year" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-none shadow-xl">
                                            {academicYears.filter(Boolean).map(ay => (
                                                <SelectItem key={ay.id} value={ay.id}>{ay.year} {ay.active ? '(Active)' : ''}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={editForm.errors.academic_year_id} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full rounded-xl h-11 bg-primary font-bold shadow-lg shadow-primary/20" disabled={editForm.processing}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout >
    );
}
