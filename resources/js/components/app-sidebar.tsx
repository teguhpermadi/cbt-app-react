import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as gradesIndex } from '@/routes/admin/grades';
import { index as examsIndex } from '@/routes/admin/exams';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, GraduationCap, Calendar, ClipboardList } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'User Management',
            href: '/admin/users',
            icon: Users,
        },
        {
            title: 'Student Management',
            href: '/admin/students',
            icon: GraduationCap,
        },
        {
            title: 'Subject Management',
            href: '/admin/subjects',
            icon: BookOpen,
        },
        {
            title: 'Academic Years',
            href: '/admin/academic-years',
            icon: Calendar,
        },
        {
            title: 'Grade Management',
            href: gradesIndex(),
            icon: GraduationCap,
        },
        {
            title: 'Exam Management',
            href: examsIndex(),
            icon: ClipboardList,
        },
        {
            title: 'Bank Soal',
            href: '/admin/question-banks',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r-0 bg-slate-50/50 dark:bg-slate-900/50">
            <SidebarHeader className="py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href={dashboard()} prefetch className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                                    <AppLogoIcon className="size-6 fill-current text-primary-foreground" />
                                </div>
                                <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
                                    <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tighter">CBT App</span>
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Dashboard</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="p-4">
                <NavFooter items={footerNavItems} className="mb-4" />
                <div className="rounded-2xl bg-white/50 p-1 shadow-sm border border-slate-100 dark:bg-slate-950/50 dark:border-slate-800">
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
