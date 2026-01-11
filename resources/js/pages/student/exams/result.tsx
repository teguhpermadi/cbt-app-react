import React, { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ExamResultView from "@/components/app/exams/exam-result-view";

interface ResultProps {
    exam: any;
    session: any;
    questions: any[];
    total_score: number;
    analysis: any[];
    norm_reference: any;
    leaderboard: any[];
}

export default function Result({ exam, session, questions, total_score, analysis, norm_reference, leaderboard }: ResultProps) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
            <Head title={`Hasil Ujian - ${exam.title}`} />

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <Link href="/student/results">
                        <Button variant="ghost" className="w-fit p-0 h-auto text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mb-2">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Riwayat
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{exam.title}</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Diselesaikan pada {new Date(session.finish_time).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                </div>

                <ExamResultView
                    exam={exam}
                    session={session}
                    questions={questions}
                    total_score={total_score}
                    analysis={analysis}
                    norm_reference={norm_reference}
                    leaderboard={leaderboard}
                />
            </div>
        </div>
    );
}
