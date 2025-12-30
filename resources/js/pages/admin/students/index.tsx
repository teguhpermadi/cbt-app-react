import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit, GraduationCap, Plus, Trash2, UserPlus } from 'lucide-react';
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
import StudentController from '@/actions/App/Http/Controllers/Admin/StudentController';
import { index } from '@/routes/admin/students';
import { dashboard } from '@/routes';

interface Student {
    id: string;
    name: string;
    username: string;
    email: string;
    grades: any[];
    created_at: string;
}

interface CreateStudentForm {
    name: string;
    username: string;
    email: string;
    password: string;
    grade_id: string;
    academic_year_id: string;
}

interface EditStudentForm {
    name: string;
    username: string;
    email: string;
    grade_id: string;
}

interface IndexProps {
    students: {
        data: Student[];
        links: any[];
    };
    grades: any[];
    academicYears: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Student Management', href: index().url },
];

export default function Index({ students, grades, academicYears }: IndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<any>(null);

    const createForm = useForm<CreateStudentForm>({
        name: '',
        username: '',
        email: '',
        password: '',
        grade_id: '',
        academic_year_id: academicYears[0]?.id || '',
    });

    const editForm = useForm<EditStudentForm>({
        name: '',
        username: '',
        email: '',
        grade_id: '',
    });

    const deleteForm = useForm();

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(StudentController.store.url(), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (student: any) => {
        setEditingStudent(student);
        editForm.setData({
            name: student.name,
            username: student.username,
            email: student.email,
            grade_id: student.grades[0]?.id || '',
        });
        setIsEditOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;
        editForm.put(StudentController.update(editingStudent?.id).url, {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
            },
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this student?')) {
            deleteForm.delete(StudentController.destroy(id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Management" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Student Management</h1>
                        <p className="text-muted-foreground font-medium">Manage student accounts and grade assignments.</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl flex items-center gap-2 bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                                <UserPlus className="size-4" />
                                Enroll New Student
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                            <form onSubmit={submitCreate}>
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">Enroll Student</DialogTitle>
                                    <DialogDescription>Create a new student account and assign a grade.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="st-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                                        <Input id="st-name" value={createForm.data.name} onChange={e => createForm.setData('name', e.target.value)} placeholder="Full Name" className="rounded-xl h-11 border-slate-200" />
                                        <InputError message={createForm.errors.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="st-username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</Label>
                                        <Input id="st-username" value={createForm.data.username} onChange={e => createForm.setData('username', e.target.value)} placeholder="Username" className="rounded-xl h-11 border-slate-200" />
                                        {/* @ts-ignore */}
                                        <InputError message={createForm.errors.username} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="st-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
                                        <Input id="st-email" type="email" value={createForm.data.email} onChange={e => createForm.setData('email', e.target.value)} placeholder="student@school.com" className="rounded-xl h-11 border-slate-200" />
                                        <InputError message={createForm.errors.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="st-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                                        <Input id="st-password" type="password" value={createForm.data.password} onChange={e => createForm.setData('password', e.target.value)} className="rounded-xl h-11 border-slate-200" />
                                        <InputError message={createForm.errors.password} />
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
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Year</Label>
                                            <Select onValueChange={(val) => createForm.setData('academic_year_id', val)} defaultValue={createForm.data.academic_year_id}>
                                                <SelectTrigger className="rounded-xl h-11 border-slate-200">
                                                    <SelectValue placeholder="Year" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-none shadow-xl">
                                                    {academicYears.filter(Boolean).map(ay => (
                                                        <SelectItem key={ay.id} value={ay.id}>{ay.year} - {ay.semester}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={createForm.errors.academic_year_id} />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full rounded-xl h-11 bg-primary font-bold shadow-lg shadow-primary/20" disabled={createForm.processing}>
                                        Enroll Student
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
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">Current Grade</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {students.data.map((student: any) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-slate-100">{student.name}</span>
                                                <span className="text-xs text-muted-foreground font-medium">{student.username} | {student.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.grades && student.grades.length > 0 ? (
                                                <Badge variant="outline" className="rounded-lg px-2.5 py-1 flex items-center gap-1.5 font-bold text-blue-600 bg-blue-50/50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50 uppercase tracking-tighter text-[10px]">
                                                    < GraduationCap className="size-3.5" />
                                                    {student.grades[0].name}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">Not Assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="rounded-lg px-2 py-0.5 border-green-200 bg-green-50 text-green-600 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-400 font-bold uppercase tracking-tighter text-[10px]">
                                                Active
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-all font-bold"
                                                    onClick={() => openEdit(student)}
                                                >
                                                    <Edit className="size-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-all font-bold"
                                                    onClick={() => handleDelete(student.id)}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination links={students.links} />
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                    <form onSubmit={submitEdit}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Edit Student</DialogTitle>
                            <DialogDescription>Update details for {editingStudent?.name}.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-st-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                                <Input id="edit-st-name" value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} className="rounded-xl h-11 border-slate-200" />
                                <InputError message={editForm.errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-st-username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</Label>
                                <Input id="edit-st-username" value={editForm.data.username} onChange={e => editForm.setData('username', e.target.value)} className="rounded-xl h-11 border-slate-200" />
                                {/* @ts-ignore */}
                                <InputError message={editForm.errors.username} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-st-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
                                <Input id="edit-st-email" type="email" value={editForm.data.email} onChange={e => editForm.setData('email', e.target.value)} className="rounded-xl h-11 border-slate-200" />
                                <InputError message={editForm.errors.email} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Grade Assignment</Label>
                                <Select onValueChange={(val) => editForm.setData('grade_id', val)} defaultValue={editForm.data.grade_id}>
                                    <SelectTrigger className="rounded-xl h-11 border-slate-200">
                                        <SelectValue placeholder="Select grade" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-xl">
                                        {grades.filter(Boolean).map(g => (
                                            <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={editForm.errors.grade_id} />
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
