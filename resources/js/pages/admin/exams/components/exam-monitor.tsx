import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface ExamSession {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
        // avatar?: string;
    };
    is_finished: boolean;
    start_time: string;
    finish_time?: string;
    total_score?: number;
    attempt_number: number;
}

interface MonitorData {
    exam: any;
    sessions: ExamSession[];
    total_students: number;
    participated_count: number;
}

interface ExamMonitorProps {
    examId: string;
}

export default function ExamMonitor({ examId }: ExamMonitorProps) {
    const [data, setData] = useState<MonitorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            // @ts-ignore
            const response = await axios.get(route('admin.exams.monitor', { exam: examId }));
            setData(response.data);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            console.error("Failed to fetch monitor data:", err);
            setError("Failed to load monitoring data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, [examId]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data?.participated_count || 0} / {data?.total_students || '-'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Students who started the exam
                        </p>
                    </CardContent>
                </Card>
                {/* Add more stats cards here if needed */}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Live Monitor</CardTitle>
                        <CardDescription>
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </CardHeader>
                <CardContent>
                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Attempt</TableHead>
                                    <TableHead>Start Time</TableHead>
                                    <TableHead>Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.sessions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No students have started this exam yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data?.sessions.map((session) => (
                                        <TableRow key={session.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    {/* <Avatar className="h-8 w-8">
                                                        <AvatarImage src={session.user.avatar} alt={session.user.name} />
                                                        <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
                                                    </Avatar> */}
                                                    <div>
                                                        <div className="font-semibold">{session.user.name}</div>
                                                        <div className="text-xs text-muted-foreground">{session.user.email}</div>
                                                    </div>
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
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Helper to make route function available in TS if not already globally typed,
// though usually provided by Ziggy. If `route` is missing, adding a declare or just using window.route if available.
// Assuming `route` global is available in this Laravel/Inertia/Ziggy setup.
