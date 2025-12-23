import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Calendar, Edit, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
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
import { Switch } from "@/components/ui/switch";
import { useState } from 'react';
import InputError from '@/components/input-error';
import Pagination from '@/components/Pagination';
import AcademicYearController from '@/actions/App/Http/Controllers/Admin/AcademicYearController';
import { index } from '@/routes/admin/academic-years';
import { dashboard } from '@/routes';

interface AcademicYear {
    id: string;
    year: string;
    semester: string;
    is_active: boolean;
    created_at: string;
}

interface IndexProps {
    academicYears: {
        data: AcademicYear[];
        links: any[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Tahun Ajaran', href: index().url },
];

export default function Index({ academicYears }: IndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);

    const createForm = useForm({
        year: '',
        semester: 'Ganjil',
        is_active: false,
    });

    const editForm = useForm({
        year: '',
        semester: '',
        is_active: false,
    });

    const deleteForm = useForm();

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(AcademicYearController.store.url(), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (ay: AcademicYear) => {
        setEditingYear(ay);
        editForm.setData({
            year: ay.year,
            semester: ay.semester,
            is_active: ay.is_active,
        });
        setIsEditOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingYear) return;
        editForm.put(AcademicYearController.update(editingYear.id).url, {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
            },
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus tahun ajaran ini?')) {
            deleteForm.delete(AcademicYearController.destroy(id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Tahun Ajaran" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Manajemen Tahun Ajaran</h1>
                        <p className="text-muted-foreground font-medium">Atur periode akademik dan semester aktif.</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02] font-bold">
                                <Plus className="size-4" />
                                Tahun Ajaran Baru
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                            <form onSubmit={submitCreate}>
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">Tambah Tahun Ajaran</DialogTitle>
                                    <DialogDescription>Buat periode akademik baru untuk sistem.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="year" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tahun (Contoh: 2023/2024)</Label>
                                        <Input id="year" value={createForm.data.year} onChange={e => createForm.setData('year', e.target.value)} placeholder="2024/2025" className="rounded-xl h-11 border-slate-200 focus:ring-indigo-500" />
                                        <InputError message={createForm.errors.year} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Semester</Label>
                                        <Select onValueChange={(val) => createForm.setData('semester', val)} defaultValue={createForm.data.semester}>
                                            <SelectTrigger className="rounded-xl h-11 border-slate-200">
                                                <SelectValue placeholder="Pilih Semester" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-none shadow-xl">
                                                <SelectItem value="Ganjil">Ganjil</SelectItem>
                                                <SelectItem value="Genap">Genap</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={createForm.errors.semester} />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                        <div className="flex flex-col gap-0.5">
                                            <Label className="text-sm font-bold">Aktifkan Sekarang</Label>
                                            <span className="text-xs text-muted-foreground">Jadikan sebagai tahun ajaran utama.</span>
                                        </div>
                                        <Switch
                                            checked={createForm.data.is_active}
                                            onCheckedChange={(val) => createForm.setData('is_active', val)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full rounded-xl h-11 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 dark:shadow-none" disabled={createForm.processing}>
                                        Simpan Tahun Ajaran
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {academicYears.data.map((ay) => (
                        <div key={ay.id} className={`relative group overflow-hidden rounded-3xl border transition-all duration-300 ${ay.is_active ? 'border-indigo-200 bg-indigo-50/30 dark:border-indigo-900/50 dark:bg-indigo-950/20' : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950'}`}>
                            {ay.is_active && (
                                <div className="absolute top-0 right-0 p-3">
                                    <Badge className="bg-indigo-500 hover:bg-indigo-500 font-bold px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">Aktif</Badge>
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`p-3 rounded-2xl ${ay.is_active ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50' : 'bg-slate-100 text-slate-500 dark:bg-slate-900'}`}>
                                        <Calendar className="size-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{ay.year}</h3>
                                        <p className="text-sm font-medium text-muted-foreground">{ay.semester} Semester</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 font-bold"
                                            onClick={() => openEdit(ay)}
                                        >
                                            <Edit className="size-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 font-bold"
                                            onClick={() => handleDelete(ay.id)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>

                                    {!ay.is_active && (
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Non-Aktif</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {academicYears.data.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <Calendar className="size-12 text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium">Belum ada data tahun ajaran.</p>
                        </div>
                    )}
                </div>

                <Pagination links={academicYears.links} />
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                    <form onSubmit={submitEdit}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Edit Tahun Ajaran</DialogTitle>
                            <DialogDescription>Perbarui informasi untuk periode akademik ini.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-year" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tahun (Contoh: 2023/2024)</Label>
                                <Input id="edit-year" value={editForm.data.year} onChange={e => editForm.setData('year', e.target.value)} className="rounded-xl h-11 border-slate-200" />
                                <InputError message={editForm.errors.year} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Semester</Label>
                                <Select onValueChange={(val) => editForm.setData('semester', val)} defaultValue={editForm.data.semester}>
                                    <SelectTrigger className="rounded-xl h-11 border-slate-200">
                                        <SelectValue placeholder="Pilih Semester" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-xl">
                                        <SelectItem value="Ganjil">Ganjil</SelectItem>
                                        <SelectItem value="Genap">Genap</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={editForm.errors.semester} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                <div className="flex flex-col gap-0.5">
                                    <Label className="text-sm font-bold">Status Aktif</Label>
                                    <span className="text-xs text-muted-foreground">Aktifkan sebagai tahun ajaran saat ini.</span>
                                </div>
                                <Switch
                                    checked={editForm.data.is_active}
                                    onCheckedChange={(val) => editForm.setData('is_active', val)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full rounded-xl h-11 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 dark:shadow-none" disabled={editForm.processing}>
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
