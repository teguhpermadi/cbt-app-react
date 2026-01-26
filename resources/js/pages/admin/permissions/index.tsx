import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import PermissionController from '@/actions/App/Http/Controllers/Admin/PermissionController';

interface Permission {
    ulid: string;
    name: string;
}

interface IndexProps {
    permissions: {
        data: Permission[];
        links: any[];
    };
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Permissions', href: '/admin/permissions' },
];

export default function Index({ permissions }: IndexProps) {
    const deleteForm = useForm();

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this permission?')) {
            deleteForm.delete(PermissionController.destroy({ permission: id }).url, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permission Management" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Permission Management</h1>
                        <p className="text-muted-foreground">Manage system permissions.</p>
                    </div>

                    <Button asChild className="rounded-xl flex items-center gap-2 bg-primary shadow-lg shadow-primary/20">
                        <Link href={PermissionController.create().url}>
                            <Plus className="size-4" />
                            Add New Permission
                        </Link>
                    </Button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-muted-foreground dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-4">Permission Name</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {permissions.data.length > 0 ? (
                                    permissions.data.map((permission) => (
                                        <tr key={permission.ulid} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="px-6 py-4 font-bold">{permission.name}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-all"
                                                        asChild
                                                    >
                                                        <Link href={PermissionController.edit({ permission: permission.ulid }).url}>
                                                            <Edit className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-all"
                                                        onClick={() => handleDelete(permission.ulid)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-8 text-center text-muted-foreground italic">
                                            No permissions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination links={permissions.links} />
            </div>
        </AppLayout>
    );
}
