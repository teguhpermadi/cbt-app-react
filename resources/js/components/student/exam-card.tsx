
import { Calendar, Clock } from 'lucide-react';

interface ExamCardProps {
    id: string;
    title: string;
    subject: string;
    grade: string;
    duration: number;
    endTime: string;
    hasStarted: boolean;
}

export function ExamCard({ id, title, subject, grade, duration, endTime, hasStarted }: ExamCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 uppercase tracking-tight">
                            {subject}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">• {grade}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h4>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5 font-medium">
                            <Clock className="size-4" />
                            {duration} Minutes
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                            <Calendar className="size-4" />
                            Ends: {new Date(endTime).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                <button className={`flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-bold transition-all ${hasStarted
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                    : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]'
                    }`}>
                    {hasStarted ? 'Continue Exam' : 'Start Exam'}
                </button>
            </div>
        </div>
    );
}
