import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, ArrowLeft, Clock, CheckCircle, XCircle, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addMinutes, differenceInSeconds } from 'date-fns';
import { useEffect, useState } from 'react';
import { index as examsIndexRoute } from '@/routes/admin/exams';

interface StudentSession {
    id: string; // Session ID
    user_id: string;
    student_name: string;
    student_email: string;
    correct_count: number;
    wrong_count: number;
    total_answered: number;
    total_questions: number;
    duration_seconds: number;
    score_current: number;
    is_finished: boolean;
    start_time: string | null;
}

interface LiveScoreProps {
    exam: {
        id: string;
        title: string;
        timer_type: 'strict' | 'flexible';
        duration: number; // in minutes
    };
    initialStudents: StudentSession[];
}

const LiveTimer = ({
    startTime,
    durationMinutes,
    timerType,
    isFinished,
    finalDurationSeconds
}: {
    startTime: string | null,
    durationMinutes: number,
    timerType: 'strict' | 'flexible',
    isFinished: boolean,
    finalDurationSeconds: number
}) => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (isFinished || !startTime) return;

        const updateTimer = () => {
            const now = new Date();
            const start = new Date(startTime);
            const diff = differenceInSeconds(now, start);
            setElapsed(diff);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [startTime, isFinished]);

    // Format helpers
    const formatTime = (totalSeconds: number) => {
        const sign = totalSeconds < 0 ? '-' : '';
        const absSeconds = Math.abs(totalSeconds);
        const h = Math.floor(absSeconds / 3600);
        const m = Math.floor((absSeconds % 3600) / 60);
        const s = absSeconds % 60;

        if (h > 0) return `${sign}${h}h ${m}m ${s}s`;
        return `${sign}${m}m ${s}s`;
    };

    if (!startTime) return <span className="text-muted-foreground">-</span>;

    if (isFinished) {
        return <span className="font-mono">{formatTime(finalDurationSeconds)}</span>;
    }

    if (timerType === 'flexible') {
        // Count UP: Show how long they have been working
        return (
            <div className="flex items-center gap-1 font-mono text-blue-600">
                <Timer className="w-3 h-3" />
                {formatTime(elapsed)}
            </div>
        );
    } else {
        // Strict: Count DOWN: Show remaining time
        // Total allowed: durationMinutes * 60
        const totalAllowed = durationMinutes * 60;
        const remaining = totalAllowed - elapsed;

        const isLow = remaining < 300; // Less than 5 mins

        return (
            <div className={`flex items-center gap-1 font-mono ${isLow ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
                <Clock className="w-3 h-3" />
                {formatTime(remaining)}
            </div>
        );
    }
};

export default function LiveScorePage({ exam, initialStudents }: LiveScoreProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Exam Management', href: examsIndexRoute.url() },
        { title: 'Monitor', href: `/admin/exams/${exam.id}/monitor` },
        { title: 'Live Score', href: '#' },
    ];

    const [students, setStudents] = useState<StudentSession[]>(initialStudents);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

    // Sorting state
    const [sortConfig, setSortConfig] = useState<{ key: keyof StudentSession, direction: 'asc' | 'desc' } | null>({ key: 'score_current', direction: 'desc' });

    useEffect(() => {
        // Subscribe to Private Channel for Progress
        const progressChannelName = `exam.monitor.${exam.id}`;

        console.log(`Subscribing to channel: ${progressChannelName}`);

        if (!(window as any).Echo) return;

        const progressChannel = (window as any).Echo.private(progressChannelName);

        progressChannel.listen('.student.progress', (e: any) => {
            // ... same progress logic ...
            const data = e.data;
            const studentId = e.studentId;

            setStudents(prev => {
                const index = prev.findIndex(s => s.user_id === studentId);

                if (index !== -1) {
                    // Update existing
                    const updated = [...prev];
                    updated[index] = {
                        ...updated[index],
                        correct_count: data.correct_count,
                        wrong_count: data.wrong_count,
                        total_answered: data.total_answered,
                        total_questions: data.total_questions,
                        duration_seconds: data.duration_seconds,
                        score_current: data.score_current,
                        student_name: data.student_name ?? updated[index].student_name,
                        is_finished: data.is_finished ?? updated[index].is_finished,
                        start_time: data.start_time ?? updated[index].start_time,
                    };
                    return updated;
                } else {
                    // New student
                    const newStudent: StudentSession = {
                        id: 'unknown-session',
                        user_id: studentId,
                        student_name: data.student_name ?? 'Unknown',
                        student_email: '',
                        correct_count: data.correct_count,
                        wrong_count: data.wrong_count,
                        total_answered: data.total_answered,
                        total_questions: data.total_questions,
                        duration_seconds: data.duration_seconds,
                        score_current: data.score_current,
                        is_finished: data.is_finished ?? false,
                        start_time: data.start_time ?? new Date().toISOString(),
                    };
                    return [...prev, newStudent];
                }
            });
        })
            .subscribed(() => {
                setIsConnected(true);
            })
            .error((error: any) => {
                console.error('Subscription error:', error);
                setIsConnected(false);
            });

        // Presence Channel
        const presenceChannelName = `exam.presence.${exam.id}`;
        const presenceChannel = (window as any).Echo.join(presenceChannelName)
            .here((users: any[]) => {
                console.log('Here users:', users);
                const ids = new Set(users.map(u => String(u.id))); // Ensure string comparison
                setOnlineUserIds(ids);
            })
            .joining((user: any) => {
                console.log('Joining:', user);
                setOnlineUserIds(prev => {
                    const next = new Set(prev);
                    next.add(String(user.id));
                    return next;
                });
            })
            .leaving((user: any) => {
                console.log('Leaving:', user);
                setOnlineUserIds(prev => {
                    const next = new Set(prev);
                    next.delete(String(user.id));
                    return next;
                });
            });


        return () => {
            console.log(`Leaving channel: ${progressChannelName}`);
            (window as any).Echo.leave(progressChannelName);
            console.log(`Leaving channel: ${presenceChannelName}`);
            (window as any).Echo.leave(presenceChannelName);
        };
    }, [exam.id]);

    // Sorting Logic
    const sortedStudents = [...students].sort((a, b) => {
        // Always Finished at bottom? Or mix?
        // User asked "sorting berdasarkan soal yang sudah dikerjakan" (based on answered count)

        if (!sortConfig) return 0;

        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof StudentSession) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Live Score - ${exam.title}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.visit(`/admin/exams/${exam.id}/monitor`)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Live Score: {exam.title}
                            </h1>
                            <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm mt-1">
                                {exam.timer_type === 'flexible' ? (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                        Flexible Timer
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                                        Strict Timer
                                    </Badge>
                                )}
                                <span>Duration: {exam.duration}m</span>
                                {isConnected ? (
                                    <Badge variant="outline" className="border-green-500 text-green-500 bg-green-50 animate-pulse ml-2">Live Connected</Badge>
                                ) : (
                                    <Badge variant="outline" className="border-yellow-500 text-yellow-500 bg-yellow-50 ml-2">Connecting...</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {students.length}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Online: {onlineUserIds.size}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Leaderboard (Live)</CardTitle>
                        <CardDescription>
                            Sorted by Answered Count initially. Click headers to sort.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table className="min-w-[1000px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="cursor-pointer" onClick={() => handleSort('student_name')}>Student Name</TableHead>
                                        <TableHead className="cursor-pointer text-center" onClick={() => handleSort('total_answered')}>Progress</TableHead>
                                        <TableHead className="cursor-pointer text-center" onClick={() => handleSort('correct_count')}>
                                            <div className="flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Correct</div>
                                        </TableHead>
                                        <TableHead className="cursor-pointer text-center" onClick={() => handleSort('wrong_count')}>
                                            <div className="flex items-center justify-center gap-1"><XCircle className="w-4 h-4 text-red-500" /> Wrong</div>
                                        </TableHead>
                                        <TableHead className="cursor-pointer text-center" onClick={() => handleSort('score_current')}>Score</TableHead>
                                        <TableHead className="cursor-pointer text-right w-[150px]">
                                            <div className="flex items-center justify-end gap-1">
                                                <Timer className="w-4 h-4" /> Time
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedStudents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                                Waiting for students to start...
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        sortedStudents.map((student) => {
                                            const isOnline = onlineUserIds.has(String(student.user_id));
                                            return (
                                                <TableRow key={student.user_id} className={student.is_finished ? 'bg-slate-50 dark:bg-slate-900/50' : ''}>
                                                    <TableCell className="w-[50px] text-center">
                                                        <div className={`w-3 h-3 rounded-full mx-auto ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} title={isOnline ? 'Online' : 'Offline'}></div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            {student.student_name}
                                                            {student.is_finished && (
                                                                <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-1 py-0 h-5">
                                                                    Selesai
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="outline">{student.total_answered} / {student.total_questions}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center text-green-600 font-bold">
                                                        {student.correct_count}
                                                    </TableCell>
                                                    <TableCell className="text-center text-red-600 font-bold">
                                                        {student.wrong_count}
                                                    </TableCell>
                                                    <TableCell className="text-center font-mono">
                                                        {student.score_current}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <LiveTimer
                                                            startTime={student.start_time}
                                                            durationMinutes={exam.duration}
                                                            timerType={exam.timer_type}
                                                            isFinished={student.is_finished}
                                                            finalDurationSeconds={student.duration_seconds}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
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
