import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { dashboard as studentDashboard } from '@/routes/student';
import { Head, Link } from '@inertiajs/react';
import { CalendarRange, GraduationCap, Users, Calendar, Trophy, ArrowRight, User, BookOpen, Clock, CheckCircle2, Star, Zap } from 'lucide-react';
// @ts-ignore
import Animal from 'react-animals';

const ANIMALS = [
    "alligator", "anteater", "armadillo", "auroch", "axolotl", "badger", "bat", "beaver", "buffalo",
    "camel", "chameleon", "cheetah", "chipmunk", "chinchilla", "chupacabra", "cormorant", "coyote",
    "crow", "dingo", "dinosaur", "dog", "dolphin", "dragon", "duck", "dumbo octopus", "elephant",
    "ferret", "fox", "frog", "giraffe", "gopher", "grizzly", "hedgehog", "hippo", "hyena", "jackal",
    "ibex", "ifrit", "iguana", "kangaroo", "koala", "kraken", "leopard", "lemur", "liger", "lion",
    "llama", "manatee", "mink", "monkey", "narwhal", "nyan cat", "orangutan", "otter", "panda",
    "penguin", "platypus", "python", "pumpkin", "quagga", "rabbit", "raccoon", "rhino", "sheep",
    "shrew", "skunk", "slow loris", "squirrel", "tiger", "turtle", "unicorn", "walrus", "wolf",
    "wolverine", "wombat"
];

const COLORS = [
    "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4",
    "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722",
    "#795548", "#607D8B"
];

const getAnimalAvatar = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const animalIndex = Math.abs(hash) % ANIMALS.length;
    const colorIndex = Math.abs(hash >> 3) % COLORS.length; // Shift to decorrelate

    return {
        name: ANIMALS[animalIndex],
        color: COLORS[colorIndex]
    };
};

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
    grades: {
        name: string;
    }[];
}

interface LeaderboardEntry {
    rank: number;
    name: string;
    username: string;
    points: number;
    avatar_url: string | null;
    is_me: boolean;
}

interface DashboardProps {
    activeAcademicYear: {
        year: string;
        semester: string;
    } | null;
    examsToday: Exam[];
    leaderboard: LeaderboardEntry[];
    stats: {
        completed_exams: number;
        average_score: number;
        upcoming_exams: number;
        total_score: number;
    };
    recentResults: any[];
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: studentDashboard(),
    },
];

export default function Dashboard({
    activeAcademicYear,
    examsToday,
    leaderboard,
    stats,
    recentResults
}: DashboardProps) {
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
                    <p className="text-muted-foreground font-medium">Here's your latest stats and exam updates.</p>
                </div>

                {/* Stats Overview - 4 Columns now */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Upcoming Exams Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900 dark:bg-slate-950">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <Calendar className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Upcoming Exams</p>
                                <h3 className="text-2xl font-bold">{stats.upcoming_exams}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Completed Exams Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-slate-950">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                <CheckCircle2 className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                                <h3 className="text-2xl font-bold">{stats.completed_exams}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Average Score Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-white p-6 shadow-sm dark:border-amber-900 dark:bg-slate-950">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                <Star className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                                <h3 className="text-2xl font-bold">{stats.average_score}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Total Score Card (NEW) */}
                    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-slate-950">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Zap className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Final Score</p>
                                <h3 className="text-2xl font-bold">{stats.total_score}</h3>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 translate-y-[-12px] opacity-10">
                            <Zap className="size-full fill-emerald-500" />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Exams Today List */}
                    <div className="flex flex-col gap-4 lg:col-span-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <CalendarRange className="size-5 text-blue-600" />
                                Available Exams
                            </h2>
                        </div>

                        <div className="grid gap-4">
                            {examsToday.length > 0 ? (
                                examsToday.map((exam) => (
                                    <div key={exam.id} className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 uppercase tracking-tight">
                                                        {exam.subject.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground font-medium">
                                                        • {exam.grades.map(g => g.name).join(', ')}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{exam.title}</h4>
                                                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <Clock className="size-4" />
                                                        {exam.duration} Minutes
                                                    </div>
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <Calendar className="size-4" />
                                                        Ends: {new Date(exam.end_time).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                // Link logic here would ideally be handled by router
                                                className={`flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-bold transition-all ${exam.has_started
                                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                                                    : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]'
                                                    }`}>
                                                {exam.has_started ? 'Continue' : 'Start'}
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

                    {/* Student Leaderboard */}
                    <div className="flex flex-col gap-4 lg:col-span-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Trophy className="size-5 text-amber-500" />
                                Top Students
                            </h2>
                        </div>

                        <div className="flex flex-col gap-0 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-950">
                            {leaderboard.length > 0 ? (
                                leaderboard.map((student, index) => {
                                    const showSeparator = index > 0 && student.rank > leaderboard[index - 1].rank + 1;

                                    return (
                                        <div key={index}>
                                            {showSeparator && (
                                                <div className="flex justify-center py-2 bg-slate-50/50 dark:bg-slate-900/30">
                                                    <span className="text-muted-foreground text-xs tracking-widest">• • •</span>
                                                </div>
                                            )}
                                            <div className={`flex items-center gap-4 border-b border-slate-100 p-4 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50 transition-colors ${student.is_me ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-sm
                                                    ${student.rank === 1 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                                                        student.rank === 2 ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400' :
                                                            student.rank === 3 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400' :
                                                                'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-500'
                                                    }`}>
                                                    {student.rank}
                                                </div>
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-slate-100 shrink-0">
                                                        {student.avatar_url ? (
                                                            <img src={student.avatar_url} alt={student.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <Animal
                                                                {...getAnimalAvatar(student.name)}
                                                                size="24px"
                                                                rounded
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                                                            {student.name} {student.is_me && '(You)'}
                                                        </p>
                                                        <p className="truncate text-xs text-muted-foreground">{student.username}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-sm font-bold text-blue-600 dark:text-blue-400">{student.points}</span>
                                                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">pts</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center">
                                    <p className="text-sm font-medium text-muted-foreground italic">No data available yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
