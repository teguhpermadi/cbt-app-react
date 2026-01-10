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

import { index as gradesIndex } from '@/routes/admin/grades';
import { index as examsIndex } from '@/routes/admin/exams';
import { dashboard as adminDashboard } from '@/routes/admin';
import { dashboard as studentDashboard } from '@/routes/student';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, GraduationCap, Calendar, ClipboardList } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';
import AppLogo from './app-logo';
import { usePermission } from '@/hooks/usePermission';

export function AppSidebar() {
    const { hasRole } = usePermission();

    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: adminDashboard(),
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
            title: 'Bank Soal',
            href: '/admin/question-banks',
            icon: BookOpen,
        },
        {
            title: 'Exam Management',
            href: examsIndex(),
            icon: ClipboardList,
            // active: true, // Example of marking active
        }
    ];

    const studentNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: studentDashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Ujian Saya',
            href: '/student/exams',
            icon: ClipboardList,
        },
        {
            title: 'Riwayat Ujian',
            href: '/student/results',
            icon: GraduationCap,
        },
    ];

    // Determine nav items based on roles
    let mainNavItems: NavItem[] = [];
    let dashboardLink = '#';

    // Prioritize Roles
    if (hasRole('student')) {
        mainNavItems = studentNavItems;
        dashboardLink = studentDashboard();
    } else if (hasRole('admin') || hasRole('teacher')) {
        mainNavItems = adminNavItems;
        dashboardLink = adminDashboard();
    }

    // Fallback for user_type if roles are not yet synced or legacy user
    const { auth } = usePage<SharedData>().props;
    if (mainNavItems.length === 0) {
        if (auth.user.user_type === 'student') {
            mainNavItems = studentNavItems;
            dashboardLink = studentDashboard();
        } else {
            mainNavItems = adminNavItems;
            dashboardLink = adminDashboard();
        }
    }

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r-0 bg-slate-50/50 dark:bg-slate-900/50">
            <SidebarHeader className="py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href={dashboardLink} prefetch className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                                    <AppLogoIcon className="size-6 fill-current text-primary-foreground" />
                                </div>
                                <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
                                    <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tighter">CBT App</span>
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                                        {auth.user.user_type === 'student' ? 'Student Area' : 'Dashboard'}
                                    </span>
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
                <div className="rounded-2xl bg-white/50 p-1 shadow-sm border border-slate-100 dark:bg-slate-950/50 dark:border-slate-800">
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
