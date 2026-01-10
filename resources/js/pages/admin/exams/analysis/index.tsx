import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react'; // Corrected router import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button'; // Ensure this path is correct based on your project structure
import { ArrowLeft, Play, RefreshCw, Info, HelpCircle, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import RichTextEditor from '@/components/ui/rich-text/RichTextEditor';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface DistractorData {
    count: number;
    percent: number;
    is_key: boolean;
}

interface ItemAnalysis {
    id: string;
    question_id: string;
    exam_question: {
        id: string;
        question_number: number;
        content: string; // HTML content
        question_type: string;
    };
    difficulty_index: number | null;
    discrimination_index: number | null;
    discrimination_status: string | null;
    distractor_analysis: Record<string, DistractorData> | null;
    analysis_recommendation: string | null;
}

interface ExamAnalysis {
    id: string;
    status: 'processing' | 'completed' | 'failed';
    student_count: number;
    reliability_coefficient: number | null;
    average_score: number | null;
    standard_deviation: number | null;
    highest_score: number | null;
    lowest_score: number | null;
    item_analyses: ItemAnalysis[];
    created_at: string;
}

interface Props {
    exam: any;
    analysis: ExamAnalysis | null;
}

export default function AnalysisIndex({ exam, analysis }: Props) {
    const { flash } = usePage<any>().props;
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Polling only if status is processing
    useEffect(() => {
        if (analysis?.status === 'processing') {
            const interval = setInterval(() => {
                router.reload({ only: ['analysis'] });
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [analysis?.status]);

    const handleRunAnalysis = () => {
        router.post(`/admin/exams/${exam.id}/analysis`, {}, {
            onStart: () => setIsRefreshing(true),
            onFinish: () => setIsRefreshing(false),
        });
    };

    const getDifficultyClass = (p: number | null) => {
        if (p === null) return "bg-gray-100 text-gray-800";
        if (p > 0.7) return "bg-green-100 text-green-800"; // Mudah
        if (p < 0.3) return "bg-red-100 text-red-800"; // Sukar
        return "bg-yellow-100 text-yellow-800"; // Sedang
    };

    const getDifficultyLabel = (p: number | null) => {
        if (p === null) return "-";
        if (p > 0.7) return "Mudah";
        if (p < 0.3) return "Sukar";
        return "Sedang";
    };

    const getDiscriminationClass = (d: number | null) => {
        if (d === null) return "bg-gray-100 text-gray-800";
        if (d >= 0.4) return "bg-green-100 text-green-800"; // Sangat Baik
        if (d >= 0.3) return "bg-blue-100 text-blue-800"; // Baik
        if (d >= 0.2) return "bg-yellow-100 text-yellow-800"; // Cukup
        return "bg-red-100 text-red-800"; // Buruk
    };

    const getDiscriminationLabel = (d: number | null) => {
        if (d === null) return "-";
        if (d >= 0.4) return "Sangat Baik";
        if (d >= 0.3) return "Baik";
        if (d >= 0.2) return "Cukup";
        return "Buruk";
    };

    const getQuestionTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            'multiple_choice': 'Pilihan Ganda',
            'true_false': 'Benar/Salah',
            'essay': 'Esai',
            'matching': 'Menjodohkan',
            'ordering': 'Mengurutkan',
            'multiple_selection': 'Pilihan Ganda Kompleks',
            'numerical_input': 'Isian Angka',
        };
        return types[type] || type;
    };

    return (
        <TooltipProvider>
            <AppLayout breadcrumbs={[
                { title: 'Manajemen Ujian', href: '/admin/exams' },
                { title: 'Monitor', href: `/admin/exams/${exam.id}/monitor` },
                { title: 'Analisis Butir Soal', href: '#' },
            ]}>
                <Head title={`Analisis - ${exam.title}`} />

                <div className="flex flex-col gap-6 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => router.visit(`/admin/exams/${exam.id}/monitor`)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                    Analisis Butir Soal: {exam.title}
                                </h1>
                                <p className="text-muted-foreground font-medium">
                                    Evaluasi kualitas ujian dan performa setiap butir soal.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => window.open(`/admin/exams/${exam.id}/analysis/export`, '_blank')}
                                disabled={!analysis || analysis.status === 'processing'}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 rotate-90" /> {/* Improvising icon or use FileSpreadsheet if available, sticking to ArrowLeft rotate for now or just Text */}
                                Download Excel
                            </Button>
                            <Button
                                onClick={handleRunAnalysis}
                                disabled={analysis?.status === 'processing' || isRefreshing}
                            >
                                {analysis?.status === 'processing' ? (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Play className="mr-2 h-4 w-4" />
                                )}
                                {analysis ? 'Analisis Ulang' : 'Jalankan Analisis'}
                            </Button>
                        </div>

                    </div>

                    {/* Explainer Accordion */}
                    <Accordion type="single" collapsible className="w-full bg-slate-50 dark:bg-slate-900 rounded-lg border px-4">
                        <AccordionItem value="item-1" className="border-b-0">
                            <AccordionTrigger className="hover:no-underline py-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    <Info className="h-4 w-4" />
                                    Panduan Membaca Analisis
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-slate-600 dark:text-slate-400 space-y-2 pb-4">
                                <p><strong>Reliabilitas (Cronbach's Alpha):</strong> Mengukur konsistensi internal ujian. Nilai <strong>{`> 0.7`}</strong> dianggap reliabel.</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                    <div className="p-2 border rounded bg-white dark:bg-slate-950">
                                        <div className="font-semibold mb-1">Tingkat Kesulitan (P)</div>
                                        <p className="text-xs">Rasio siswa yang menjawab benar. Rentang 0-1.</p>
                                        <ul className="text-xs list-disc ml-4 mt-1">
                                            <li>0.0 - 0.3: <strong>Sukar</strong> (Terlalu sulit)</li>
                                            <li>0.3 - 0.7: <strong>Sedang</strong> (Ideal)</li>
                                            <li>0.7 - 1.0: <strong>Mudah</strong> (Terlalu gampang)</li>
                                        </ul>
                                    </div>
                                    <div className="p-2 border rounded bg-white dark:bg-slate-950">
                                        <div className="font-semibold mb-1">Daya Beda (D)</div>
                                        <p className="text-xs">Kemampuan soal membedakan siswa pandai (kelompok atas) dan kurang (bawah).</p>
                                        <ul className="text-xs list-disc ml-4 mt-1">
                                            <li>{`>= 0.40`}: <strong>Sangat Baik</strong></li>
                                            <li>0.30 - 0.39: <strong>Baik</strong></li>
                                            <li>0.20 - 0.29: <strong>Cukup</strong> (Perlu revisi)</li>
                                            <li>{`< 0.20`}: <strong>Buruk</strong> (Buang/Revisi total)</li>
                                        </ul>
                                    </div>
                                    <div className="p-2 border rounded bg-white dark:bg-slate-950">
                                        <div className="font-semibold mb-1">Efektivitas Pengecoh</div>
                                        <p className="text-xs">Pengecoh (opsi salah) yang baik harus dipilih oleh minimal 5% peserta, terutama dari kelompok bawah.</p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {!analysis ? (
                        <Card>
                            <CardContent className="pt-6 text-center text-muted-foreground">
                                Belum ada data analisis. Klik tombol "Jalankan Analisis" untuk memulai.
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {analysis.status === 'processing' && (
                                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Sedang memproses!</strong>
                                    <span className="block sm:inline"> Analisis sedang berjalan di latar belakang. Hasil akan muncul otomatis.</span>
                                </div>
                            )}

                            {/* Reliability Stats */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Reliabilitas</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {analysis.reliability_coefficient?.toFixed(3) ?? '-'}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {analysis.reliability_coefficient && analysis.reliability_coefficient > 0.7 ? 'Reliabilitas Tinggi' : 'Perlu Perbaikan'}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Jumlah Peserta</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {analysis.student_count}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Siswa</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {analysis.average_score?.toFixed(2) ?? '-'}
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                            Standar Deviasi: {analysis.standard_deviation?.toFixed(2) ?? '-'}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Rentang Nilai</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {analysis.lowest_score} - {analysis.highest_score}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Min - Max</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Item Analysis Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistik Butir Soal</CardTitle>
                                    <CardDescription>Analisis detail per nomor soal.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md border overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[50px] min-w-[50px]">No</TableHead>
                                                    <TableHead className="w-[30%] min-w-[400px]">Konten Soal</TableHead>
                                                    <TableHead className="min-w-[150px]">Tipe</TableHead>
                                                    <TableHead className="min-w-[150px]">Tingkat Kesulitan (P)</TableHead>
                                                    <TableHead className="min-w-[150px]">Daya Beda (D)</TableHead>
                                                    <TableHead className="min-w-[300px]">Distribusi Pengecoh</TableHead>
                                                    <TableHead className="min-w-[250px]">Rekomendasi</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {analysis.item_analyses && analysis.item_analyses.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium align-top pt-4">{item.exam_question?.question_number}</TableCell>
                                                        <TableCell className="align-top">
                                                            <div className="border rounded-md overflow-hidden bg-white max-h-[200px] overflow-y-auto">
                                                                <RichTextEditor
                                                                    value={item.exam_question?.content || 'Konten tidak tersedia'}
                                                                    readOnly
                                                                    className="border-0 min-h-[60px]"
                                                                />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="align-top pt-4">
                                                            <Badge variant="outline">
                                                                {getQuestionTypeLabel(item.exam_question?.question_type)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="align-top pt-4">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="secondary" className={getDifficultyClass(item.difficulty_index)}>
                                                                        {item.difficulty_index?.toFixed(2) ?? '-'}
                                                                    </Badge>
                                                                </div>
                                                                <span className="text-xs text-muted-foreground">
                                                                    ({getDifficultyLabel(item.difficulty_index)})
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="align-top pt-4">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="secondary" className={getDiscriminationClass(item.discrimination_index)}>
                                                                        {item.discrimination_index?.toFixed(2) ?? '-'}
                                                                    </Badge>
                                                                </div>
                                                                <span className="text-xs text-muted-foreground">
                                                                    ({getDiscriminationLabel(item.discrimination_index)})
                                                                </span>
                                                                {/* <span className="text-xs font-medium text-muted-foreground">Status: {item.discrimination_status || '-'}</span> */}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="align-top pt-4">
                                                            {item.exam_question?.question_type === 'essay' ? (
                                                                <span className="text-muted-foreground italic text-sm">-</span>
                                                            ) : (
                                                                /* Distractor Mini Visualization - Vertical Layout */
                                                                <div className="flex flex-col gap-2 w-full min-w-[180px]">
                                                                    {Object.entries(item.distractor_analysis || {}).map(([key, data]) => (
                                                                        <Tooltip key={key}>
                                                                            <TooltipTrigger asChild>
                                                                                <div className="flex items-center gap-2 w-full text-xs cursor-help">
                                                                                    {/* <span className={`font-bold w-4 pr-2 ${data.is_key ? 'text-green-600' : 'text-slate-500'}`}>{key}</span> */}
                                                                                    <div className="w-1/2 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                                        <div
                                                                                            className={`h-full ${data.is_key ? 'bg-green-500' : 'bg-slate-400 dark:bg-slate-600'}`}
                                                                                            style={{ width: `${data.percent}%` }}
                                                                                        />
                                                                                    </div>
                                                                                    <span className="w-8 text-right text-muted-foreground">{data.percent}%</span>
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <div className="text-xs">
                                                                                    <p className="font-bold">Opsi {key} {data.is_key && '(Kunci)'}</p>
                                                                                    <p>Dipilih: <span className="font-semibold text-primary">{data.count} siswa</span> ({data.percent}%)</p>
                                                                                </div>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="align-top pt-4">
                                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                                {item.analysis_recommendation || '-'}
                                                            </p>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </AppLayout>
        </TooltipProvider>
    );
}