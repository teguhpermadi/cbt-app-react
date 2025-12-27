
interface ResultCardProps {
    id: string;
    title: string;
    subject: string;
    score: number;
}

export function ResultCard({ id, title, subject, score }: ResultCardProps) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${score >= 70 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                {Math.round(score)}
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
                <h5 className="truncate text-sm font-bold">{title}</h5>
                <p className="text-xs font-medium text-muted-foreground">{subject}</p>
            </div>
        </div>
    );
}
