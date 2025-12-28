import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { BookText, Edit, Plus, Trash2 } from 'lucide-react';
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
import GradeController from '@/actions/App/Http/Controllers/Admin/GradeController';
import { index } from '@/routes/admin/grades';
import { dashboard } from '@/routes';
import { Users } from 'lucide-react';
import ManageStudentsModal from './ManageStudentsModal';

interface Grade {
    id: string;
    name: string;
    level: string | null;
    academic_year: {
        id: string;
        year: string;
    };
    students_count: number;
}

interface CreateGradeForm {
    name: string;
    level: string;
    academic_year_id: string;
}

interface EditGradeForm {
    name: string;
    level: string;
    academic_year_id: string;
}

interface IndexProps {
    grades: {
        data: Grade[];
        links: any[];
    };
    academicYears: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Grade Management', href: index().url },
];

export default function Index({ grades, academicYears }: IndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false);
    const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
    const [managingGrade, setManagingGrade] = useState<Grade | null>(null);

    const createForm = useForm<CreateGradeForm>({
        name: '',
        level: '',
        academic_year_id: academicYears.find((ay: any) => ay.active)?.id || academicYears[0]?.id || '',
    });

    const editForm = useForm<EditGradeForm>({
        name: '',
        level: '',
        academic_year_id: '',
    });

    const deleteForm = useForm();

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(GradeController.store.url(), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (grade: Grade) => {
        setEditingGrade(grade);
        editForm.setData({
            name: grade.name,
            level: grade.level || '',
            academic_year_id: grade.academic_year?.id || '',
        });
        setIsEditOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingGrade) return;
        editForm.put(GradeController.update(editingGrade?.id).url, {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
            },
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this grade?')) {
            deleteForm.delete(GradeController.destroy(id).url);
        }
    };

    const openManageStudents = (grade: Grade) => {
        setManagingGrade(grade);
        setIsManageStudentsOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Grade Management" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Grade Management</h1>
                        <p className="text-muted-foreground font-medium">Manage grades and academic levels.</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl flex items-center gap-2 bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                                <Plus className="size-4" />
                                Create New Grade
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl">
                            <form onSubmit={submitCreate}>
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">Create Grade</DialogTitle>
                                    <DialogDescription>Create a new grade for the academic year.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="grade-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Grade Name</Label>
                                            <Input id="grade-name" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} placeholder="e.g. 10th Grade" className="rounded-xl h-11 border-slate-200" />
                                            <InputError message={createForm.errors.name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="grade-level" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Level</Label>
                                            <Input id="grade-level" value={createForm.data.level} onChange={(e) => createForm.setData('level', e.target.value)} placeholder="e.g. X" className="rounded-xl h-11 border-slate-200" />
                                            <InputError message={createForm.errors.level} />
                                        </div>
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
                                <DialogFooter>
                                    <Button type="submit" className="w-full rounded-xl h-11 bg-primary font-bold shadow-lg shadow-primary/20" disabled={createForm.processing}>
                                        Create Grade
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
                                    <th className="px-6 py-4">Grade Name</th>
                                    <th className="px-6 py-4">Level</th>
                                    <th className="px-6 py-4">Academic Year</th>
                                    <th className="px-6 py-4">Students</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {grades.data.length > 0 ? (
                                    grades.data.map((grade: Grade) => (
                                        <tr key={grade.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 dark:text-slate-100">{grade.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {grade.level && <Badge variant="secondary">{grade.level}</Badge>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {grade.academic_year?.year || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="font-mono">
                                                    {grade.students_count}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 transition-all font-bold"
                                                        onClick={() => openManageStudents(grade)}
                                                        title="Manage Students"
                                                    >
                                                        <Users className="size-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-all font-bold"
                                                        onClick={() => openEdit(grade)}
                                                    >
                                                        <Edit className="size-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-all font-bold"
                                                        onClick={() => handleDelete(grade.id)}
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
                                            No grades found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination links={grades.links} />
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl">
                    <form onSubmit={submitEdit}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Edit Grade</DialogTitle>
                            <DialogDescription>Update details for {editingGrade?.name}.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-grade-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Grade Name</Label>
                                    <Input id="edit-grade-name" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} className="rounded-xl h-11 border-slate-200" />
                                    <InputError message={editForm.errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-grade-level" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Level</Label>
                                    <Input id="edit-grade-level" value={editForm.data.level} onChange={(e) => editForm.setData('level', e.target.value)} className="rounded-xl h-11 border-slate-200" />
                                    <InputError message={editForm.errors.level} />
                                </div>
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
                        <DialogFooter>
                            <Button type="submit" className="w-full rounded-xl h-11 bg-primary font-bold shadow-lg shadow-primary/20" disabled={editForm.processing}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ManageStudentsModal
                grade={managingGrade}
                open={isManageStudentsOpen}
                onOpenChange={setIsManageStudentsOpen}
            />
        </AppLayout >
    );
}
