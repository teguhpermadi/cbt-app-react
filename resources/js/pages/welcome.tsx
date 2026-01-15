import { dashboard as adminDashboard } from '@/routes/admin';
import { dashboard as studentDashboard } from '@/routes/student';
import { login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    const getDashboardRoute = () => {
        if (auth.user.user_type === 'student') {
            return studentDashboard();
        }
        return adminDashboard();
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-6 text-[#1b1b18] dark:from-gray-900 dark:to-blue-950 dark:text-[#EDEDEC]">
                <div className="w-full max-w-2xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-blue-900 sm:text-6xl dark:text-blue-400">
                        Selamat Datang di Aplikasi CBT
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Platform ujian berbasis komputer yang elegan dan mudah digunakan.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
                        {auth.user ? (
                            <Link
                                href={getDashboardRoute()}
                                className="min-w-[140px] rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/50 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="min-w-[140px] rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/50 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="min-w-[140px] rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-lg shadow-gray-200/50 ring-1 ring-inset ring-blue-100 transition-all duration-200 hover:bg-blue-50 hover:shadow-blue-100/50 hover:-translate-y-0.5 dark:bg-gray-800 dark:text-blue-400 dark:shadow-none dark:ring-gray-700 dark:hover:bg-gray-750"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
