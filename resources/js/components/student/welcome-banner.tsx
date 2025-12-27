
import { cn } from '@/lib/utils';

interface WelcomeBannerProps {
    title: string;
    description: string;
    className?: string;
}

export function WelcomeBanner({ title, description, className }: WelcomeBannerProps) {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-muted-foreground font-medium">{description}</p>
        </div>
    );
}
