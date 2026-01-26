import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Edit, GraduationCap, Plus, Trash2, UserPlus, CheckSquare, Square, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { dashboard } from '@/routes/admin';
import ImportStudentModal from './import-student-modal';
import { FileSpreadsheet } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    username: string;
    email: string;
    grades: any[];
    roles: any[];
    created_at: string;
}

interface Role {
    ulid: string;
    name: string;
}

interface CreateStudentForm {
    name: string;
    username: string;
    email: string;
    password: string;
    grade_id: string;
    academic_year_id: string;
    roles: string[];
}

interface EditStudentForm {
    name: string;
    username: string;
    email: string;
    grade_id: string;
    roles: string[];
}

interface IndexProps {
    students: {
        data: Student[];
        links: any[];
    };
    grades: any[];
    academicYears: any[];
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Student Management', href: index().url },
];

export default function Index({ students, grades, academicYears, roles }: IndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<any>(null);

    // Bulk Actions State
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBulkGradeOpen, setIsBulkGradeOpen] = useState(false);
    const [isBulkRolesOpen, setIsBulkRolesOpen] = useState(false);

    const bulkGradeForm = useForm({
        grade_id: '',
        academic_year_id: academicYears[0]?.id || '',
    });

    const bulkRolesForm = useForm({
        roles: ['student'] as string[],
    });

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(students.data.map(s => s.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectUser = (userId: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, userId]);
        } else {
            setSelectedIds(prev => prev.filter(id => id !== userId));
        }
    };

    const submitBulkGrade = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(StudentController.bulkAction.url(), {
            ids: selectedIds,
            action: 'update_grade',
            data: bulkGradeForm.data
        }, {
            onSuccess: () => {
                setIsBulkGradeOpen(false);
                setSelectedIds([]);
                bulkGradeForm.reset();
            }
        });
    };

    const submitBulkRoles = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(StudentController.bulkAction.url(), {
            ids: selectedIds,
            action: 'update_roles',
            data: bulkRolesForm.data
        }, {
            onSuccess: () => {
                setIsBulkRolesOpen(false);
                setSelectedIds([]);
                bulkRolesForm.reset();
            }
        });
    };

    const createForm = useForm<CreateStudentForm>({
        name: '',
        username: '',
        email: '',
        password: '',
        grade_id: '',
        academic_year_id: academicYears[0]?.id || '',
        roles: ['student'],
    });

    const editForm = useForm<EditStudentForm>({
        name: '',
        username: '',
        email: '',
        grade_id: '',
        roles: [],
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
            roles: student.roles.map((r: any) => r.name),
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

                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl dark:bg-slate-800 animate-in fade-in slide-in-from-top-2">
                            <span className="text-sm font-medium px-2">{selectedIds.length} selected</span>
                            <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1" />

                            <Dialog open={isBulkGradeOpen} onOpenChange={setIsBulkGradeOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="secondary" className="h-8 rounded-lg text-xs font-bold">
                                        <GraduationCap className="size-3.5 mr-2" />
                                        Set Grade
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                                    <form onSubmit={submitBulkGrade}>
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold">Bulk Assign Grade</DialogTitle>
                                            <DialogDescription>Assign grade to {selectedIds.length} students.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Grade</Label>
                                                <Select onValueChange={(val) => bulkGradeForm.setData('grade_id', val)}>
                                                    <SelectTrigger className="rounded-xl h-11 border-slate-200">
                                                        <SelectValue placeholder="Select Grade" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-none shadow-xl">
                                                        {grades.filter(Boolean).map(g => (
                                                            <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Year</Label>
                                                <Select onValueChange={(val) => bulkGradeForm.setData('academic_year_id', val)} defaultValue={bulkGradeForm.data.academic_year_id}>
                                                    <SelectTrigger className="rounded-xl h-11 border-slate-200">
                                                        <SelectValue placeholder="Year" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-none shadow-xl">
                                                        {academicYears.filter(Boolean).map(ay => (
                                                            <SelectItem key={ay.id} value={ay.id}>{ay.year} - {ay.semester}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="w-full rounded-xl h-11 bg-primary font-bold shadow-lg shadow-primary/20">
                                                Update Students
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isBulkRolesOpen} onOpenChange={setIsBulkRolesOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="secondary" className="h-8 rounded-lg text-xs font-bold">
                                        <Settings2 className="size-3.5 mr-2" />
                                        Set Roles
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                                    <form onSubmit={submitBulkRoles}>
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold">Bulk Assign Roles</DialogTitle>
                                            <DialogDescription>Update roles for {selectedIds.length} students.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Roles</Label>
                                                <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
                                                    {roles.map((role) => (
                                                        <div key={role.ulid} className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                id={`bulk-role-${role.ulid}`}
                                                                className="rounded border-slate-300 text-primary shadow-sm focus:ring-primary"
                                                                checked={bulkRolesForm.data.roles.includes(role.name)}
                                                                onChange={(e) => {
                                                                    const checked = e.target.checked;
                                                                    const currentRoles = bulkRolesForm.data.roles;
                                                                    if (checked) {
                                                                        bulkRolesForm.setData('roles', [...currentRoles, role.name]);
                                                                    } else {
                                                                        bulkRolesForm.setData('roles', currentRoles.filter(r => r !== role.name));
                                                                    }
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor={`bulk-role-${role.ulid}`}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                                                            >
                                                                {role.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="w-full rounded-xl h-11 bg-primary font-bold shadow-lg shadow-primary/20">
                                                Update Roles
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Button size="sm" variant="ghost" className="h-8 rounded-lg text-xs" onClick={() => setSelectedIds([])}>
                                Cancel
                            </Button>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="rounded-xl flex items-center gap-2 border-slate-200 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                            onClick={() => setIsImportOpen(true)}
                        >
                            <FileSpreadsheet className="size-4 text-green-600" />
                            Import Excel
                        </Button>

                        <a href={StudentController.export().url}>
                            <Button
                                variant="outline"
                                className="rounded-xl flex items-center gap-2 border-slate-200 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                            >
                                <FileSpreadsheet className="size-4 text-blue-600" />
                                Download Data
                            </Button>
                        </a>

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
                                        <div className="grid gap-4 sm:grid-cols-2">
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
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Roles</Label>
                                            <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
                                                {roles.map((role) => (
                                                    <div key={role.ulid} className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`create-role-${role.ulid}`}
                                                            className="rounded border-slate-300 text-primary shadow-sm focus:ring-primary"
                                                            checked={createForm.data.roles.includes(role.name)}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                const currentRoles = createForm.data.roles;
                                                                if (checked) {
                                                                    createForm.setData('roles', [...currentRoles, role.name]);
                                                                } else {
                                                                    createForm.setData('roles', currentRoles.filter(r => r !== role.name));
                                                                }
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`create-role-${role.ulid}`}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                                                        >
                                                            {role.name}
                                                        </label>
                                                    </div>
                                                ))}
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
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-[800px] w-full text-left text-sm">
                            <thead className="border-b bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-muted-foreground dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-4 w-[50px]">
                                        <Checkbox
                                            checked={selectedIds.length === students.data.length && students.data.length > 0}
                                            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                        />
                                    </th>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">Current Grade</th>
                                    <th className="px-6 py-4">Roles</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {students.data.map((student: any) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Checkbox
                                                checked={selectedIds.includes(student.id)}
                                                onCheckedChange={(checked) => handleSelectUser(student.id, checked as boolean)}
                                            />
                                        </td>
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
                                            <div className="flex flex-wrap gap-1">
                                                {student.roles && student.roles.length > 0 ? (
                                                    student.roles.filter(Boolean).map((role: any) => (
                                                        <Badge key={role.ulid || role.id} variant="secondary" className="rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                                                            {role.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">No role</span>
                                                )}
                                            </div>
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
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Roles</Label>
                                <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
                                    {roles.map((role) => (
                                        <div key={role.ulid} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`edit-role-${role.ulid}`}
                                                className="rounded border-slate-300 text-primary shadow-sm focus:ring-primary"
                                                checked={editForm.data.roles.includes(role.name)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    const currentRoles = editForm.data.roles;
                                                    if (checked) {
                                                        editForm.setData('roles', [...currentRoles, role.name]);
                                                    } else {
                                                        editForm.setData('roles', currentRoles.filter(r => r !== role.name));
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor={`edit-role-${role.ulid}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                                            >
                                                {role.name}
                                            </label>
                                        </div>
                                    ))}
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

            <ImportStudentModal
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
            />
        </AppLayout >
    );
}
