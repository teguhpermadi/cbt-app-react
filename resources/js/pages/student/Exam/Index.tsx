import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { ExamCard } from '@/components/student/exam-card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Exam {
    id: string;
    title: string;
    subject: string;
    grade: string;
    duration: number;
    endTime: string;
    hasStarted: boolean;
}

interface Props {
    exams: Exam[];
    message?: string;
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/student/dashboard',
    },
    {
        title: 'Exams',
        href: '/student/exams',
    },
];

export default function ExamIndex({ exams, message }: Props) {
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Available Exams" />


            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Available Exams
                    </h1>
                    <p className="text-muted-foreground">
                        List of exams available for you to take right now.
                    </p>
                </div>

                {message && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Notice</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}

                {exams.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {exams.map((exam) => (
                            <ExamCard
                                key={exam.id}
                                id={exam.id}
                                title={exam.title}
                                subject={exam.subject}
                                grade={exam.grade}
                                duration={exam.duration}
                                endTime={exam.endTime}
                                hasStarted={exam.hasStarted}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center animate-in fade-in-50 dark:border-slate-800 dark:bg-slate-900/50">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                            <AlertCircle className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No Exams Available</h3>
                        <p className="mb-4 mt-2 max-w-sm text-sm text-muted-foreground">
                            You don't have any active exams at the moment. Please check back later or contact your teacher.
                        </p>
                    </div>
                )}
            </div>
        </AppSidebarLayout>
    );
}
