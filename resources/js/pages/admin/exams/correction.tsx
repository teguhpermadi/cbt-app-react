import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { index as examsIndexRoute } from '@/routes/admin/exams';

interface CorrectionProps {
    session: any;
}

export default function CorrectionPage({ session }: CorrectionProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Exam Management', href: examsIndexRoute.url() },
        { title: 'Monitor', href: `/admin/exams/${session.exam_id}/monitor` },
        { title: 'Correction', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Correction - ${session.user.name}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Correction: {session.user.name}
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Review and grade student answers for {session.exam.title}.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{session.exam_result?.total_score ?? 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Score Percentage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{session.exam_result?.score_percent ?? 0}%</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {session.exam_result?.is_passed ? (
                                <Badge className="bg-green-100 text-green-800">PASSED</Badge>
                            ) : (
                                <Badge variant="destructive">FAILED</Badge>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-4">
                    {session.exam_result_details.map((detail: any, index: number) => (
                        <Card key={detail.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                                    <div className="flex items-center gap-2">
                                        {detail.is_correct === true && <Badge className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3" /> Correct</Badge>}
                                        {detail.is_correct === false && <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Incorrect</Badge>}
                                        {detail.is_correct === null && <Badge variant="outline"><HelpCircle className="mr-1 h-3 w-3" /> Pending</Badge>}
                                        <Badge variant="secondary">Score: {detail.score_earned} / {detail.exam_question.score_value}</Badge>
                                    </div>
                                </div>
                                <CardDescription dangerouslySetInnerHTML={{ __html: detail.exam_question.content }} />
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-md border p-3 bg-muted/50">
                                        <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Student Answer</div>
                                        <div className="text-sm">
                                            {typeof detail.student_answer === 'object' ? JSON.stringify(detail.student_answer) : (detail.student_answer || '-')}
                                        </div>
                                    </div>
                                    <div className="rounded-md border p-3 bg-green-50 dark:bg-green-950/20">
                                        <div className="text-xs font-semibold uppercase text-green-700 dark:text-green-400 mb-2">Key Answer</div>
                                        <div className="text-sm">
                                            {JSON.stringify(detail.exam_question.key_answer)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
