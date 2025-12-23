import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-background p-6 md:p-10">
            {/* Mesh Background Effect - Blue Theme */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-500/20" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-sky-500/10 blur-[120px] dark:bg-sky-500/20" />
            </div>

            <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="group flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30 transition-all group-hover:scale-110 group-hover:rotate-3">
                                <AppLogoIcon className="size-9 fill-current text-primary-foreground" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">CBT Application</span>
                            </div>
                        </Link>

                        <div className="space-y-1 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {title}
                            </h1>
                            <p className="text-balance text-sm text-muted-foreground font-medium">
                                {description}
                            </p>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-border/50 bg-card/60 p-4 shadow-2xl backdrop-blur-xl sm:p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
