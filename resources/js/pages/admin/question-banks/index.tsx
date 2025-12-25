import { AppContent } from '@/components/app-content';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';

import Pagination from '@/components/Pagination';

// Wayground Imports
import { index } from '@/routes/admin/question-banks';
import QuestionBankController from '@/actions/App/Http/Controllers/Admin/QuestionBankController';

interface QuestionBank {
    id: number;
    name: string;
    is_public: boolean;
    subject?: {
        name: string;
        grade?: {
            name: string;
        };
    };
    teacher?: {
        name: string;
    };
}

interface IndexProps {
    questionBanks: {
        data: QuestionBank[];
        links: any[]; // Using any[] for simplicity as Pagination props usually handle this
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ questionBanks, filters }: IndexProps) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this question bank?')) {
            // Using QuestionBankController.destroy(id)
            router.delete(QuestionBankController.destroy(id).url);
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Bank Soal', href: index().url }]}>
            <Head title="Bank Soal" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Bank Soal</h1>
                        <p className="text-muted-foreground font-medium">Kelola kumpulan soal untuk ujian.</p>
                    </div>
                    <Button asChild className="rounded-xl flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02] font-bold">
                        <Link href={QuestionBankController.create().url}>
                            <Plus className="size-4" />
                            Buat Bank Soal
                        </Link>
                    </Button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-muted-foreground dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-4">Nama</th>
                                    <th className="px-6 py-4">Mata Pelajaran</th>
                                    <th className="px-6 py-4">Kelas</th>
                                    <th className="px-6 py-4">Guru</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {questionBanks.data.length > 0 ? (
                                    questionBanks.data.map((bank) => (
                                        <tr key={bank.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="px-6 py-4 font-medium">
                                                <div className="font-bold text-slate-900 dark:text-slate-100">{bank.name}</div>
                                            </td>
                                            <td className="px-6 py-4">{bank.subject?.name || '-'}</td>
                                            <td className="px-6 py-4">{bank.subject?.grade?.name || '-'}</td>
                                            <td className="px-6 py-4">{bank.teacher?.name || '-'}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={bank.is_public ? 'default' : 'secondary'}>
                                                    {bank.is_public ? 'Publik' : 'Privat'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-all font-bold"
                                                        onClick={() => router.visit(QuestionBankController.edit(bank.id).url)}
                                                    >
                                                        <Edit className="size-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-all font-bold"
                                                        onClick={() => handleDelete(bank.id)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                            Tidak ada data ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination links={questionBanks.links} />
            </div>
        </AppSidebarLayout>
    );
}
