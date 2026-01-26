import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import RoleController from '@/actions/App/Http/Controllers/Admin/RoleController';

interface Role {
    ulid: string;
    name: string;
    permissions: { ulid: string; name: string }[];
}

interface IndexProps {
    roles: {
        data: Role[];
        links: any[];
    };
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Roles', href: '/admin/roles' },
];

export default function Index({ roles }: IndexProps) {
    const deleteForm = useForm();

    const handleDelete = (ulid: string) => {
        if (confirm('Are you sure you want to delete this role?')) {
            deleteForm.delete(RoleController.destroy(ulid).url, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Management" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Role Management</h1>
                        <p className="text-muted-foreground">Manage roles and their permissions.</p>
                    </div>

                    <Button asChild className="rounded-xl flex items-center gap-2 bg-primary shadow-lg shadow-primary/20">
                        <Link href={RoleController.create().url}>
                            <Plus className="size-4" />
                            Add New Role
                        </Link>
                    </Button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-muted-foreground dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-4">Role Name</th>
                                    <th className="px-6 py-4">Permissions</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {roles.data.length > 0 ? (
                                    roles.data.map((role) => (
                                        <tr key={role.ulid} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="px-6 py-4 font-bold align-top">{role.name}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {role.permissions.map((perm) => (
                                                        <Badge key={perm.ulid} variant="secondary" className="rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                                                            {perm.name}
                                                        </Badge>
                                                    ))}
                                                    {role.permissions.length === 0 && <span className="text-muted-foreground italic text-xs">No permissions</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right align-top">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-all"
                                                        asChild
                                                    >
                                                        <Link href={RoleController.edit(role.ulid).url}>
                                                            <Edit className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-all"
                                                        onClick={() => handleDelete(role.ulid)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground italic">
                                            No roles found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination links={roles.links} />
            </div>
        </AppLayout>
    );
}
