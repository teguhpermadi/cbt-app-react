import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react'; // Corrected router import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button'; // Ensure this path is correct based on your project structure
import { ArrowLeft, Play, RefreshCw, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

interface DistractorData {
    count: number;
    percent: number;
    is_key: boolean;
}

interface ItemAnalysis {
    id: string;
    question_id: string;
    exam_question: {
        id: string;
        question_number: number;
        content: string; // HTML content
    };
    difficulty_index: number | null;
    discrimination_index: number | null;
    discrimination_status: string | null;
    distractor_analysis: Record<string, DistractorData> | null;
}

interface ExamAnalysis {
    id: string;
    status: 'processing' | 'completed' | 'failed';
    student_count: number;
    reliability_coefficient: number | null;
    average_score: number | null;
    standard_deviation: number | null;
    highest_score: number | null;
    lowest_score: number | null;
    item_analyses: ItemAnalysis[];
    created_at: string;
}

interface Props {
    exam: any;
    analysis: ExamAnalysis | null;
}

export default function AnalysisIndex({ exam, analysis }: Props) {
    const { flash } = usePage<any>().props;
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Polling only if status is processing
    useEffect(() => {
        if (analysis?.status === 'processing') {
            const interval = setInterval(() => {
                router.reload({ only: ['analysis'] });
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [analysis?.status]);

    const handleRunAnalysis = () => {
        router.post(`/admin/exams/${exam.id}/analysis`, {}, {
            onStart: () => setIsRefreshing(true),
            onFinish: () => setIsRefreshing(false),
        });
    };

    const getDifficultyClass = (p: number | null) => {
        if (p === null) return "bg-gray-100 text-gray-800";
        if (p > 0.7) return "bg-green-100 text-green-800"; // Easy
        if (p < 0.3) return "bg-red-100 text-red-800"; // Difficult
        return "bg-yellow-100 text-yellow-800"; // Moderate
    };

    const getDiscriminationClass = (d: number | null) => {
        if (d === null) return "bg-gray-100 text-gray-800";
        if (d >= 0.4) return "bg-green-100 text-green-800"; // Very Good
        if (d >= 0.3) return "bg-blue-100 text-blue-800"; // Good
        if (d >= 0.2) return "bg-yellow-100 text-yellow-800"; // Fair
        return "bg-red-100 text-red-800"; // Poor
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Exam Management', href: '/admin/exams' },
            { title: 'Monitor', href: `/admin/exams/${exam.id}/monitor` },
            { title: 'Item Analysis', href: '#' },
        ]}>
            <Head title={`Analysis - ${exam.title}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.visit(`/admin/exams/${exam.id}/monitor`)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Item Analysis: {exam.title}
                            </h1>
                            <p className="text-muted-foreground font-medium">
                                Evaluation of exam quality and item performance.
                            </p>
                        </div>
                    </div>
                    <div>
                        <Button
                            onClick={handleRunAnalysis}
                            disabled={analysis?.status === 'processing' || isRefreshing}
                        >
                            {analysis?.status === 'processing' ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Play className="mr-2 h-4 w-4" />
                            )}
                            {analysis ? 'Re-run Analysis' : 'Run Analysis'}
                        </Button>
                    </div>
                </div>

                {!analysis ? (
                    <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                            No analysis has been performed yet. Click "Run Analysis" to start.
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {analysis.status === 'processing' && (
                            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Processing!</strong>
                                <span className="block sm:inline"> Analysis is currently running in the background. Result will appear here automatically.</span>
                            </div>
                        )}

                        {/* Reliability Stats */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Reliability (Cronbach's Alpha)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {analysis.reliability_coefficient?.toFixed(3) ?? '-'}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {analysis.reliability_coefficient && analysis.reliability_coefficient > 0.7 ? 'High Reliability' : 'Needs Improvement'}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Participants</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {analysis.student_count}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {analysis.average_score?.toFixed(2) ?? '-'}
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        SD: {analysis.standard_deviation?.toFixed(2) ?? '-'}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Range</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {analysis.lowest_score} - {analysis.highest_score}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Item Analysis Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Item Statistics</CardTitle>
                                <CardDescription>Detailed analysis per question.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">No</TableHead>
                                            <TableHead className="w-[400px]">Question Snippet</TableHead>
                                            <TableHead>Difficulty (P)</TableHead>
                                            <TableHead>Discrimination (D)</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Distractors</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {analysis.item_analyses && analysis.item_analyses.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.exam_question?.question_number}</TableCell>
                                                <TableCell>
                                                    <div className="line-clamp-2 text-sm text-muted-foreground"
                                                        dangerouslySetInnerHTML={{ __html: item.exam_question?.content || 'Content unavailable' }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={getDifficultyClass(item.difficulty_index)}>
                                                        {item.difficulty_index?.toFixed(2) ?? '-'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={getDiscriminationClass(item.discrimination_index)}>
                                                        {item.discrimination_index?.toFixed(2) ?? '-'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs font-medium">{item.discrimination_status ?? '-'}</span>
                                                </TableCell>
                                                <TableCell>
                                                    {/* Distractor Mini Visualization */}
                                                    <div className="flex gap-1 h-6 items-end">
                                                        {Object.entries(item.distractor_analysis || {}).map(([key, data]) => (
                                                            <div key={key} title={`${key}: ${data.count} (${data.percent}%)`} className="flex flex-col items-center group relative">
                                                                <div
                                                                    className={`w-4 ${data.is_key ? 'bg-green-500' : 'bg-slate-300'}`}
                                                                    style={{ height: `${Math.max(10, data.percent)}%` }} // Minimum height for visibility
                                                                ></div>
                                                                <span className="text-[10px] text-muted-foreground">{key}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
