import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-1 py-4">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-4">Menu</SidebarGroupLabel>
            <SidebarMenu className="mt-2 space-y-1">
                {items.map((item) => {
                    const isActive = page.url.startsWith(resolveUrl(item.href));
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                className={`h-11 rounded-xl transition-all duration-200 px-4 ${isActive
                                        ? 'bg-primary/10 text-primary font-bold shadow-sm border border-primary/20'
                                        : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:scale-[1.02]'
                                    }`}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch className="flex items-center gap-3">
                                    {item.icon && <item.icon className={`size-[18px] ${isActive ? 'text-primary' : 'text-slate-500'}`} />}
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
