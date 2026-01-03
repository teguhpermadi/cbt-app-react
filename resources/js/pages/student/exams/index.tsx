import { Head, Link } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { AlertCircle, Clock, Calendar, CheckCircle2, PlayCircle, Timer } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { show as showRoute, index as examsIndexRoute } from '@/routes/student/exams';
import { dashboard as dashboardRoute } from '@/routes/student';

// Helper to format date
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

interface Exam {
    id: string;
    title: string;
    subject: string;
    grade: string;
    duration: number;
    timer_type: 'strict' | 'flexible';
    endTime: string;
    hasIncompleteSession: boolean;
}

interface Props {
    exams: Exam[];
    message?: string;
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: dashboardRoute.url(),
    },
    {
        title: 'Ujian Saya',
        href: examsIndexRoute.url(),
    },
];

export default function ExamIndex({ exams, message }: Props) {
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Ujian Saya" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 md:p-6 space-y-6 animate-in fade-in-50 duration-500">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Daftar Ujian
                    </h1>
                    <p className="text-muted-foreground">
                        Berikut adalah daftar ujian yang tersedia untuk Anda kerjakan saat ini.
                    </p>
                </div>

                {message && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Perhatian</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}

                {exams.length > 0 ? (
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="h-12 px-4 font-medium text-slate-500 dark:text-slate-400">Judul Ujian</th>
                                        <th className="h-12 px-4 font-medium text-slate-500 dark:text-slate-400">Mata Pelajaran</th>
                                        <th className="h-12 px-4 font-medium text-slate-500 dark:text-slate-400">Kelas</th>
                                        <th className="h-12 px-4 font-medium text-slate-500 dark:text-slate-400">Durasi & Waktu</th>
                                        <th className="h-12 px-4 font-medium text-slate-500 dark:text-slate-400">Status</th>
                                        <th className="h-12 px-4 font-medium text-slate-500 dark:text-slate-400 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {exams.map((exam) => (
                                        <tr key={exam.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </div>
                                                    <span>{exam.title}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-600 dark:text-slate-400">{exam.subject}</td>
                                            <td className="p-4 text-slate-600 dark:text-slate-400">
                                                <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
                                                    {exam.grade}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1 text-xs text-slate-500">
                                                    {exam.timer_type === 'strict' && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span>{exam.duration} Menit</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                                                        <Timer className="h-3.5 w-3.5" />
                                                        <span>Selesai: {formatDate(exam.endTime)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={exam.hasIncompleteSession ? "secondary" : "default"} className={cn(
                                                    exam.hasIncompleteSession
                                                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                        : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                                                )}>
                                                    {exam.hasIncompleteSession ? 'Sedang Dikerjakan' : 'Tersedia'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button asChild size="sm" className={cn(
                                                    exam.hasIncompleteSession
                                                        ? "bg-yellow-600 hover:bg-yellow-700"
                                                        : "bg-blue-600 hover:bg-blue-700"
                                                )}>
                                                    <Link href={showRoute.url({ exam: exam.id })}>
                                                        {exam.hasIncompleteSession ? (
                                                            <>
                                                                <PlayCircle className="mr-2 h-4 w-4" />
                                                                Lanjutkan Ujian
                                                            </>
                                                        ) : (
                                                            <>
                                                                <PlayCircle className="mr-2 h-4 w-4" />
                                                                Mulai Ujian
                                                            </>
                                                        )}
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                ) : (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center animate-in fade-in-50 dark:border-slate-800 dark:bg-slate-900/50">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                            <AlertCircle className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Belum Ada Ujian</h3>
                        <p className="mb-6 mt-2 max-w-sm text-muted-foreground">
                            Saat ini belum ada jadwal ujian yang tersedia untuk Anda. Silakan cek kembali nanti.
                        </p>
                        <Button variant="outline" asChild>
                            <Link href={dashboardRoute.url()}>Kembali ke Dashboard</Link>
                        </Button>
                    </div>
                )}
            </div>
        </AppSidebarLayout>
    );
}
