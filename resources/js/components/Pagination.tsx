import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

export default function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap justify-center gap-1 mt-6">
            {links.map((link, key) => {
                // Filter out unnecessary labels if needed, but usually we handle them by styling
                const isPrevious = link.label.includes('&laquo;') || link.label.includes('Previous');
                const isNext = link.label.includes('&raquo;') || link.label.includes('Next');

                // Clean up label for rendering
                let label = link.label;
                if (isPrevious) label = '';
                if (isNext) label = '';
                if (!isPrevious && !isNext) {
                    label = link.label;
                }

                // If it's a "..." separator
                if (link.url === null && link.label === '...') {
                    return (
                        <div
                            key={key}
                            className="flex items-center justify-center px-3 py-2 text-sm text-slate-500"
                        >
                            ...
                        </div>
                    );
                }

                // Render button
                return (
                    <Button
                        key={key}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        className={`h-8 min-w-[2rem] px-3 rounded-lg font-medium text-xs ${link.active
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
                            } ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                        asChild={!!link.url}
                        disabled={!link.url}
                    >
                        {link.url ? (
                            <Link href={link.url} preserveScroll>
                                {isPrevious && <ChevronLeft className="size-4" />}
                                {isNext && <ChevronRight className="size-4" />}
                                {!isPrevious && !isNext && <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                            </Link>
                        ) : (
                            <span>
                                {isPrevious && <ChevronLeft className="size-4" />}
                                {isNext && <ChevronRight className="size-4" />}
                            </span>
                        )}
                    </Button>
                );
            })}
        </div>
    );
}
