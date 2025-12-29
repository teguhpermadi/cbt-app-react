import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExamSessionDetail from './components/exam-session-detail';
import { index as examsIndexRoute } from '@/routes/admin/exams';

interface CorrectionProps {
    session: any;
    all_sessions?: any[];
}

export default function CorrectionPage({ session, all_sessions }: CorrectionProps) {
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

                <Tabs defaultValue={session.id.toString()} className="w-full">
                    <div className="w-full overflow-x-auto pb-2">
                        <TabsList className="w-full flex h-auto p-1 bg-muted/40 rounded-lg justify-start gap-2">
                            {(all_sessions || [session]).map((s: any) => (
                                <TabsTrigger
                                    key={s.id}
                                    value={s.id.toString()}
                                    className="flex flex-col items-start gap-1 py-2 px-4 h-auto data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
                                >
                                    <span className="font-semibold">Attempt #{s.attempt_number}</span>
                                    <div className="flex items-center gap-2">
                                        {s.is_finished ? (
                                            <span className="text-[10px] text-muted-foreground bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                                                Score: {s.exam_result?.total_score ?? '-'}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-muted-foreground bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                                                Ongoing
                                            </span>
                                        )}
                                        <span className="text-[10px] text-muted-foreground">
                                            {s.exam_result?.is_passed ? "Passed" : (!s.is_finished ? "Active" : "Failed")}
                                        </span>
                                    </div>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {(all_sessions || [session]).map((s: any) => (
                        <TabsContent key={s.id} value={s.id.toString()} className="mt-6">
                            <ExamSessionDetail session={s} />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </AppLayout>
    );
}
