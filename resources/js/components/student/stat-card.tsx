
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: 'blue' | 'amber' | 'indigo' | 'green';
    className?: string;
}

const colorStyles = {
    blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-100 dark:border-blue-900',
        fill: 'fill-blue-500',
    },
    amber: {
        bg: 'bg-amber-50 dark:bg-amber-900/30',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-100 dark:border-amber-900', // adapting to amber border if needed or stick to blue
        fill: 'fill-amber-500',
    },
    indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/30',
        text: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-100 dark:border-indigo-900',
        fill: 'fill-indigo-500',
    },
    green: {
        bg: 'bg-green-50 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-100 dark:border-green-900',
        fill: 'fill-green-500',
    },
};

export function StatCard({ title, value, icon: Icon, color, className }: StatCardProps) {
    const styles = colorStyles[color];

    return (
        <div className={cn("relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-950 transition-all hover:shadow-md", styles.border, className)}>
            <div className="flex items-center gap-4">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", styles.bg, styles.text)}>
                    <Icon className="size-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                </div>
            </div>
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 translate-y-[-12px] opacity-10">
                <Icon className={cn("size-full", styles.fill)} />
            </div>
        </div>
    );
}
