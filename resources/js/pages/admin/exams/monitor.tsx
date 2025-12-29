import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react'; // Add router import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { index as examsIndexRoute } from '@/routes/admin/exams'; // Import route helper

interface ExamSession {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;

    };
    is_finished: boolean;
    start_time: string;
    finish_time?: string;
    total_score?: number;
    attempt_number: number;
}

interface MonitorProps {
    exam: any;
    sessions: ExamSession[];
    total_students: number;
    participated_count: number;
}

export default function MonitorPage({ exam, sessions, total_students, participated_count }: MonitorProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Exam Management', href: examsIndexRoute.url() },
        { title: 'Monitor', href: '#' },
    ];

    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);

    const refreshData = () => {
        setLoading(true);
        router.reload({
            only: ['sessions', 'participated_count'],
            onFinish: () => {
                setLoading(false);
                setLastUpdated(new Date());
            },
        });
    };

    useEffect(() => {
        const interval = setInterval(refreshData, 30000); // 30s auto refresh
        return () => clearInterval(interval);
    }, []);



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Monitor - ${exam.title}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.visit(examsIndexRoute.url())}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Monitor: {exam.title}
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Live tracking of student progress.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {participated_count} / {total_students || '-'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Students started
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Live Results</CardTitle>
                            <CardDescription>
                                Last updated: {lastUpdated.toLocaleTimeString()}
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Attempt</TableHead>
                                        <TableHead>Start Time</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sessions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                No students have started this exam yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        sessions.map((session) => (
                                            <TableRow key={session.id}>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div className="font-semibold">{session.user.name}</div>
                                                        <div className="text-xs text-muted-foreground">{session.user.email}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {session.is_finished ? (
                                                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Finished</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">Ongoing</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>#{session.attempt_number}</TableCell>
                                                <TableCell>
                                                    {session.start_time ? format(new Date(session.start_time), 'MMM d, HH:mm') : '-'}
                                                    {session.finish_time && (
                                                        <div className="text-xs text-muted-foreground">
                                                            Finished: {format(new Date(session.finish_time), 'HH:mm')}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {session.total_score !== undefined && session.total_score !== null ? (
                                                        <span className="font-bold">{session.total_score}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {session.is_finished && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.visit(`/admin/exams/sessions/${session.id}/correction`)}
                                                        >
                                                            Koreksi
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
