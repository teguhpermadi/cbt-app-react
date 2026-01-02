import React, { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, ArrowLeft } from 'lucide-react';
import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/dist/contrib/auto-render';

interface ResultProps {
    exam: any;
    session: any;
    questions: any[];
    total_score: number;
}

export default function Result({ exam, session, questions, total_score }: ResultProps) {
    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <Head title={`Hasil Ujian - ${exam.title}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header / Score Card */}
                <div className="flex flex-col md:flex-row gap-6">
                    <Card className="flex-1 bg-white shadow-sm border-2 border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-lg text-muted-foreground">Total Skor Anda</CardTitle>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-5xl font-extrabold text-primary">{Math.round(total_score)}</span>
                                <span className="text-sm text-muted-foreground">/ 100</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span>Benar: {questions.filter(q => q.is_correct).length}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span>Salah: {questions.filter(q => !q.is_correct && q.type !== 'essay').length}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex-1 bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>{exam.title}</CardTitle>
                            <CardDescription>
                                Diselesaikan pada {new Date(session.finish_time).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <Link href="/student/dashboard">
                                <Button variant="outline" className="w-full gap-2">
                                    <Home className="w-4 h-4" />
                                    Kembali ke Dashboard
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Questions Review List */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800">Review Jawaban</h3>
                    {questions.map((q, index) => (
                        <Card key={q.id} className="overflow-hidden">
                            <CardHeader className="bg-slate-50/50 pb-3">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center p-0 border-slate-300 bg-white">
                                            {index + 1}
                                        </Badge>
                                        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{q.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={q.is_correct ? 'default' : q.type === 'essay' ? 'secondary' : 'destructive'}>
                                            {q.type === 'essay' ? 'Sedang Ditinjau' : (q.is_correct ? 'Benar' : 'Salah')}
                                        </Badge>
                                        {q.type !== 'essay' && (
                                            <span className="text-sm font-bold text-slate-700">
                                                +{q.score_earned} Poin
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                {/* Question Content */}
                                <MathContent content={q.content} className="prose prose-sm max-w-none" />

                                {q.media_url && (
                                    <div className="rounded-lg overflow-hidden border">
                                        {q.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
                                            <video controls src={q.media_url} className="max-w-full max-h-[400px]" />
                                        ) : (
                                            <img src={q.media_url} alt="Question media" className="max-w-full max-h-[400px] object-contain" />
                                        )}
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-2">
                                        <span className="text-xs font-semibold text-slate-500 uppercase">Jawaban Anda</span>
                                        <div className={`p-3 rounded-lg border text-sm ${q.is_correct ? 'bg-green-50 border-green-200 text-green-800' : (q.type === 'essay' ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-200 text-red-800')}`}>
                                            {formatAnswer(q.student_answer)}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-xs font-semibold text-slate-500 uppercase">Kunci Jawaban</span>
                                        <div className="p-3 rounded-lg border bg-blue-50 border-blue-200 text-blue-800 text-sm">
                                            {formatAnswer(q.key_answer)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div >
        </div >
    );
}

function formatAnswer(answer: any): React.ReactNode {
    if (answer === null || answer === undefined) return '-';

    if (typeof answer === 'object') {
        // Handle matching pairs specific case if it looks like {L1: "...", ...}
        // or just general object stringification
        if (Array.isArray(answer)) {
            return answer.join(', ');
        }

        // Pretty print object
        return (
            <pre className="whitespace-pre-wrap font-mono text-xs">
                {JSON.stringify(answer, null, 2)}
            </pre>
        );
    }

    return String(answer);
}

function MathContent({ content, className }: { content: string, className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            renderMathInElement(ref.current, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        }
    }, [content]);

    return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: content || '' }} />;
}
