import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head } from '@inertiajs/react';
import { StatCard } from '@/components/student/stat-card';
import { WelcomeBanner } from '@/components/student/welcome-banner';
import { ExamCard } from '@/components/student/exam-card';
import { ResultCard } from '@/components/student/result-card';
import { BookOpen, Calendar, CheckCircle2, GraduationCap, Star, Trophy } from 'lucide-react';

interface DashboardProps {
    activeExams: {
        id: string;
        title: string;
        subject: string;
        grade: string;
        duration: number;
        end_time: string;
        has_started: boolean;
    }[];
    recentResults: {
        id: string;
        title: string;
        subject: string;
        score: number;
        date: string;
    }[];
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/student/dashboard',
    },
];

export default function Dashboard({ activeExams, recentResults }: DashboardProps) {
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                <WelcomeBanner
                    title="Welcome Back, Student!"
                    description="Here's what's happening with your exams today."
                />

                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard
                        title="Upcoming Exams"
                        value={activeExams.length}
                        icon={Calendar}
                        color="blue"
                    />
                    <StatCard
                        title="Completed Exams"
                        value={recentResults.length}
                        icon={CheckCircle2}
                        color="indigo"
                    />
                    <StatCard
                        title="Average Score"
                        value={recentResults.length > 0 ? (recentResults.reduce((acc, curr) => acc + curr.score, 0) / recentResults.length).toFixed(1) : 0}
                        icon={Star}
                        color="amber"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Active Exams List */}
                    <div className="flex flex-col gap-4 lg:col-span-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <GraduationCap className="size-5 text-blue-600" />
                                Available Exams
                            </h2>
                        </div>

                        <div className="grid gap-4">
                            {activeExams.length > 0 ? (
                                activeExams.map((exam) => (
                                    <ExamCard
                                        key={exam.id}
                                        id={exam.id}
                                        title={exam.title}
                                        subject={exam.subject}
                                        grade={exam.grade}
                                        duration={exam.duration}
                                        endTime={exam.end_time}
                                        hasStarted={exam.has_started}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-slate-900">
                                        <BookOpen className="size-8" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-bold">No exams available</h3>
                                    <p className="max-w-[280px] text-sm text-muted-foreground mt-1 font-medium">Check back later or contact your teacher for the exam schedule.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent History */}
                    <div className="flex flex-col gap-4 lg:col-span-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Trophy className="size-5 text-amber-500" />
                            Recent Results
                        </h2>

                        <div className="flex flex-col gap-3">
                            {recentResults.length > 0 ? (
                                recentResults.map((result) => (
                                    <ResultCard
                                        key={result.id}
                                        id={result.id}
                                        title={result.title}
                                        subject={result.subject}
                                        score={result.score}
                                    />
                                ))
                            ) : (
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/30">
                                    <p className="text-sm font-medium text-muted-foreground italic">No recent results found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
