import { Head, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Lock, Clock, FileText, User, AlertTriangle, ShieldCheck } from 'lucide-react';
import React from 'react';
import { start as startRoute, index as examsIndexRoute } from '@/routes/student/exams';
import { dashboard as dashboardRoute } from '@/routes/student';

interface Props {
    exam: {
        id: string;
        title: string;
        description?: string;
        duration: number;
        timer_type: 'strict' | 'flexible';
        passing_score: number;
        is_token_visible: boolean;
        token?: string;
        subject: { name: string };
        start_time: string;
        end_time: string;
    };
    student: {
        id: string;
        name: string;
        email: string;
    };
}

export default function ExamShow({ exam, student }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        token: exam.is_token_visible ? (exam.token || '') : '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(startRoute.url({ exam: exam.id }));
    };

    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: dashboardRoute.url(),
        },
        {
            title: 'Ujian Saya',
            href: examsIndexRoute.url(),
        },
        {
            title: exam.title,
            href: '#',
        },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Mulai Ujian - ${exam.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 md:p-6 animate-in zoom-in-95 duration-500">
                <div className="w-full max-w-3xl space-y-6 mx-auto">

                    <div className="text-center space-y-2 mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Konfirmasi Ujian
                        </h1>
                        <p className="text-muted-foreground">
                            Silakan periksa detail ujian dan identitas Anda sebelum memulai.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Exam Information */}
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm md:col-span-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    Informasi Ujian
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Judul Ujian</Label>
                                    <p className="font-medium text-lg text-slate-900 dark:text-slate-100">{exam.title}</p>
                                </div>
                                <Separator />
                                <div>
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Mata Pelajaran</Label>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">{exam.subject?.name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {exam.timer_type === 'strict' && (
                                        <div>
                                            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Durasi</Label>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <Clock className="h-4 w-4 text-slate-500" />
                                                <span className="font-medium">{exam.duration} Menit</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className={exam.timer_type === 'flexible' ? 'col-span-2' : ''}>
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">KKM</Label>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <ShieldCheck className="h-4 w-4 text-green-600" />
                                            <span className="font-medium">{exam.passing_score}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Student Information */}
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm md:col-span-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <User className="h-5 w-5 text-purple-600" />
                                    Peserta Ujian
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                    <div className="text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-2xl font-bold text-slate-600 dark:text-slate-300 mb-2">
                                            {student.name.charAt(0)}
                                        </div>
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">{student.name}</p>
                                        <p className="text-sm text-muted-foreground">{student.email}</p>
                                    </div>
                                </div>

                                <Alert className="bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-900/50">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Penting!</AlertTitle>
                                    <AlertDescription className="text-xs">
                                        Pastikan data di atas adalah benar data Anda. Jangan mengerjakan ujian milik orang lain.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Token & Start */}
                    <Card className="border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-slate-900 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-blue-600" />
                                Token Ujian
                            </CardTitle>
                            <CardDescription>
                                Masukkan token ujian yang diberikan oleh pengawas untuk memulai.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={submit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="token">Kode Token</Label>
                                    <div className="relative">
                                        <Input
                                            id="token"
                                            type="text"
                                            value={data.token}
                                            onChange={(e) => setData('token', e.target.value.toUpperCase())}
                                            className="text-center text-2xl font-mono tracking-[0.5em] h-14 uppercase"
                                            placeholder="------"
                                            maxLength={6}
                                            disabled={exam.is_token_visible} // If visible, it's auto-filled and disabled
                                        />
                                        {exam.is_token_visible && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                <Badge variant="secondary" className="bg-green-100 text-green-700">Auto-filled</Badge>
                                            </div>
                                        )}
                                    </div>
                                    {errors.token && (
                                        <p className="text-sm font-medium text-destructive">{errors.token}</p>
                                    )}
                                    {exam.is_token_visible && (
                                        <p className="text-xs text-muted-foreground text-center">
                                            Token otomatis terisi untuk ujian ini.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                                    disabled={processing}
                                >
                                    {processing ? 'Memproses...' : 'MULAI UJIAN SEKARANG'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                </div>
            </div>
        </AppSidebarLayout>
    );
}
