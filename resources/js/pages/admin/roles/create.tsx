import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { ArrowLeft } from 'lucide-react';
import RoleController from '@/actions/App/Http/Controllers/Admin/RoleController';

interface Permission {
    id: string;
    name: string;
}

interface CreateProps {
    permissions: Permission[];
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Roles', href: '/admin/roles' },
    { title: 'Create Role', href: '#' },
];

export default function Create({ permissions }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(RoleController.store().url);
    };

    const togglePermission = (name: string) => {
        if (data.permissions.includes(name)) {
            setData('permissions', data.permissions.filter(p => p !== name));
        } else {
            setData('permissions', [...data.permissions, name]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />

            <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="rounded-xl h-10 w-10" asChild>
                        <Link href={route('admin.roles.index')}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create New Role</h1>
                        <p className="text-muted-foreground">Define a new role and assign permissions.</p>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Role Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g. Editor"
                                className="rounded-xl h-11 border-slate-200"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Permissions</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-xl border border-slate-200 p-4 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
                                {permissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`perm-${permission.id}`}
                                            checked={data.permissions.includes(permission.name)}
                                            onCheckedChange={() => togglePermission(permission.name)}
                                        />
                                        <label
                                            htmlFor={`perm-${permission.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                                        >
                                            {permission.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <InputError message={errors.permissions} />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="rounded-xl px-8 h-11 bg-primary font-bold shadow-lg shadow-primary/20" disabled={processing}>
                                Create Role
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
