import { Head, Link } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, FileText, Clock, BarChart3, ChevronRight } from 'lucide-react';
import ExamResultController from '@/actions/App/Http/Controllers/Student/ExamResultController';

interface ExamSession {
    id: string;
    exam_id: string;
    exam_title: string;
    subject: string;
    attempt_number: number;
    finish_time: string;
    score: number;
    show_result: boolean;
}

interface HistoryProps {
    sessions: ExamSession[];
}

export default function History({ sessions }: HistoryProps) {
    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/student/dashboard',
        },
        {
            title: 'Riwayat Ujian',
            href: '/student/results',
        },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Ujian" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Riwayat Ujian</h1>
                        <p className="text-muted-foreground">
                            Daftar ujian yang telah Anda selesaikan beserta skornya.
                        </p>
                    </div>
                </div>

                {sessions.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <FileText className="h-6 w-6 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium">Belum ada riwayat ujian</h3>
                            <p className="text-muted-foreground max-w-sm mt-1">
                                Anda belum menyelesaikan ujian apapun. Ujian yang selesai akan muncul di halaman ini.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {sessions.map((session) => (
                            <Card key={session.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="p-6 flex-1 space-y-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                    {session.subject}
                                                </Badge>
                                                <Badge variant="secondary">
                                                    Percobaan ke-{session.attempt_number}
                                                </Badge>
                                            </div>
                                            <h3 className="font-semibold text-lg">{session.exam_title}</h3>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {new Date(session.finish_time).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-4 w-4" />
                                                    <span>
                                                        {new Date(session.finish_time).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 border-t md:border-t-0 md:border-l p-6 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 min-w-[200px]">
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Skor</p>
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className={`text-3xl font-bold ${session.score >= 75 ? 'text-green-600' : 'text-slate-700'}`}>
                                                        {session.score}
                                                    </span>
                                                </div>
                                            </div>

                                            {session.show_result ? (
                                                <Link href={ExamResultController.showSession(session.id).url}>
                                                    <Button size="sm" className="w-[140px] gap-1">
                                                        <BarChart3 className="w-4 h-4" />
                                                        Lihat Detail
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button size="sm" variant="outline" disabled className="w-[140px] opacity-70">
                                                    Detail Hidden
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppSidebarLayout>
    );
}
