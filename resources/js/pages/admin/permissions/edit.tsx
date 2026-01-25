import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { ArrowLeft } from 'lucide-react';
import PermissionController from '@/actions/App/Http/Controllers/Admin/PermissionController';

interface Permission {
    id: string;
    name: string;
}

interface EditProps {
    permission: Permission;
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Permissions', href: '/admin/permissions' },
    { title: 'Edit Permission', href: '#' },
];

export default function Edit({ permission }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: permission.name,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(PermissionController.update(permission.id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Permission: ${permission.name}`} />

            <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto w-full">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="rounded-xl h-10 w-10" asChild>
                        <Link href={route('admin.permissions.index')}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Permission</h1>
                        <p className="text-muted-foreground">Modify permission details.</p>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Permission Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="rounded-xl h-11 border-slate-200"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="rounded-xl px-8 h-11 bg-primary font-bold shadow-lg shadow-primary/20" disabled={processing}>
                                Update Permission
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
