import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit, Plus, Trash2, UserPlus, X } from 'lucide-react';
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
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import { index } from '@/routes/admin/users';
import { dashboard } from '@/routes/admin';

interface Role {
    id: string;
    name: string;
}

interface IndexProps {
    users: {
        data: User[];
        links: any[];
    };
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'User Management', href: index().url },
];

export default function Index({ users, roles }: IndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const createForm = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        user_type: 'teacher',
        roles: [] as string[],
    });

    const editForm = useForm({
        name: '',
        username: '',
        email: '',
        user_type: '',
        roles: [] as string[],
    });

    const deleteForm = useForm();

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(UserController.store.url(), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (user: any) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            username: user.username,
            email: user.email,
            user_type: user.user_type,
            roles: user.roles.map((r: any) => r.name),
        });
        setIsEditOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        editForm.put(UserController.update(editingUser?.id).url, {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
            },
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            deleteForm.delete(UserController.destroy(id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                        <p className="text-muted-foreground">Manage administrators, teachers, and parents.</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl flex items-center gap-2 bg-primary shadow-lg shadow-primary/20">
                                <UserPlus className="size-4" />
                                Add New User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                            <form onSubmit={submitCreate}>
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">Add New User</DialogTitle>
                                    <DialogDescription>Create a new administrative or teaching account.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                                        <Input id="name" value={createForm.data.name} onChange={e => createForm.setData('name', e.target.value)} placeholder="John Doe" className="rounded-xl h-11 border-slate-200" />
                                        <InputError message={createForm.errors.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</Label>
                                        <Input id="username" value={createForm.data.username} onChange={e => createForm.setData('username', e.target.value)} placeholder="Username" className="rounded-xl h-11 border-slate-200" />
                                        {/* @ts-ignore */}
                                        <InputError message={createForm.errors.username} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
                                        <Input id="email" type="email" value={createForm.data.email} onChange={e => createForm.setData('email', e.target.value)} placeholder="john@example.com" className="rounded-xl h-11 border-slate-200" />
                                        <InputError message={createForm.errors.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                                        <Input id="password" type="password" value={createForm.data.password} onChange={e => createForm.setData('password', e.target.value)} className="rounded-xl h-11 border-slate-200" />
                                        <InputError message={createForm.errors.password} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">User Type</Label>
                                        <Select onValueChange={(val) => createForm.setData('user_type', val)} defaultValue={createForm.data.user_type}>
                                            <SelectTrigger className="rounded-xl h-11 border-slate-200">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-none shadow-xl">
                                                <SelectItem value="admin">Administrator</SelectItem>
                                                <SelectItem value="teacher">Teacher</SelectItem>
                                                <SelectItem value="parent">Parent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={createForm.errors.user_type} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Roles</Label>
                                        <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
                                            {roles.map((role) => (
                                                <div key={role.id} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`create-role-${role.id}`}
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
                                                        htmlFor={`create-role-${role.id}`}
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
                                        Save User
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Table Section */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-muted-foreground dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-4">Name & Email</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Roles</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {users.data.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-slate-100">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.username} | {user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 lowercase tracking-tighter">
                                            <Badge variant="outline" className="rounded-lg px-2 py-0.5 border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-400 font-bold uppercase text-[10px]">
                                                {user.user_type}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles && user.roles.length > 0 ? (
                                                    user.roles.filter(Boolean).map((role: any) => (
                                                        <Badge key={role.id} variant="secondary" className="rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                                                            {role.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">No role</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-all"
                                                    onClick={() => openEdit(user)}
                                                >
                                                    <Edit className="size-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-all"
                                                    onClick={() => handleDelete(user.id)}
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
                <Pagination links={users.links} />
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                    <form onSubmit={submitEdit}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Edit User</DialogTitle>
                            <DialogDescription>Update the information for {editingUser?.name}.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                                <Input id="edit-name" value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} className="rounded-xl h-11 border-slate-200" />
                                <InputError message={editForm.errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</Label>
                                <Input id="edit-username" value={editForm.data.username} onChange={e => editForm.setData('username', e.target.value)} className="rounded-xl h-11 border-slate-200" />
                                {/* @ts-ignore */}
                                <InputError message={editForm.errors.username} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
                                <Input id="edit-email" type="email" value={editForm.data.email} onChange={e => editForm.setData('email', e.target.value)} className="rounded-xl h-11 border-slate-200" />
                                <InputError message={editForm.errors.email} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">User Type</Label>
                                <Select onValueChange={(val) => editForm.setData('user_type', val)} defaultValue={editForm.data.user_type}>
                                    <SelectTrigger className="rounded-xl h-11 border-slate-200">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-xl">
                                        <SelectItem value="admin">Administrator</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                        <SelectItem value="parent">Parent</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={editForm.errors.user_type} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Roles</Label>
                                <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
                                    {roles.map((role) => (
                                        <div key={role.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`edit-role-${role.id}`}
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
                                                htmlFor={`edit-role-${role.id}`}
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
                                Update Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout >
    );
}
