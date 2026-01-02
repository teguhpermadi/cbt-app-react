import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen, Calendar, CheckCircle2, Clock, GraduationCap, LayoutDashboard, Star, Trophy } from 'lucide-react';

interface Exam {
    id: string;
    title: string;
    duration: number;
    start_time: string;
    end_time: string;
    has_started: boolean;
    subject: {
        name: string;
    };
    grade: string;
}

interface DashboardProps {
    activeExams: Exam[];
    stats: {
        completed_exams: number;
        average_score: number;
        upcoming_exams: number;
    };
    recentResults: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ activeExams, stats, recentResults }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back!</h1>
                    <p className="text-muted-foreground font-medium">Here's what's happening with your exams today.</p>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900 dark:bg-slate-950">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <CheckCircle2 className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Exams Completed</p>
                                <h3 className="text-2xl font-bold">{stats.completed_exams}</h3>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 translate-y-[-12px] opacity-10">
                            <CheckCircle2 className="size-full fill-blue-500" />
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900 dark:bg-slate-950">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                <Star className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                                <h3 className="text-2xl font-bold">{stats.average_score}</h3>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 translate-y-[-12px] opacity-10">
                            <Star className="size-full fill-amber-500" />
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900 dark:bg-slate-950">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                <Calendar className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Upcoming Exams</p>
                                <h3 className="text-2xl font-bold">{stats.upcoming_exams}</h3>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 translate-y-[-12px] opacity-10">
                            <Calendar className="size-full fill-indigo-500" />
                        </div>
                    </div>
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
                                    <div key={exam.id} className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 uppercase tracking-tight">
                                                        {exam.subject.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground font-medium">• {exam.grade}</span>
                                                </div>
                                                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{exam.title}</h4>
                                                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <Clock className="size-4" />
                                                        {exam.duration} Minutes
                                                    </div>
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <Calendar className="size-4" />
                                                        Ends: {new Date(exam.end_time).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <button className={`flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-bold transition-all ${exam.has_started
                                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                                                : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]'
                                                }`}>
                                                {exam.has_started ? 'Continue Exam' : 'Start Exam'}
                                            </button>
                                        </div>
                                    </div>
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
                                    <div key={result.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${result.total_score >= 70 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {Math.round(result.total_score)}
                                        </div>
                                        <div className="flex min-w-0 flex-col gap-0.5">
                                            <h5 className="truncate text-sm font-bold">{result.exam.title}</h5>
                                            <p className="text-xs font-medium text-muted-foreground">{result.exam.subject.name}</p>
                                        </div>
                                    </div>
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
        </AppLayout>
    );
}
