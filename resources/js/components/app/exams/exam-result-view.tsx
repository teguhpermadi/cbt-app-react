import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Trophy, Target, CheckCircle, XCircle, HelpCircle,
    Users, Medal, BarChart3, MessageSquare
} from 'lucide-react';
import PreviewStudentAnswer from "@/components/app/questions/results/PreviewStudentAnswer";
import MathRenderer from "@/components/app/questions/MathRenderer";
// @ts-ignore
import Animal from 'react-animals';

const ANIMALS = [
    "alligator", "anteater", "armadillo", "auroch", "axolotl", "badger", "bat", "beaver", "buffalo",
    "camel", "chameleon", "cheetah", "chipmunk", "chinchilla", "chupacabra", "cormorant", "coyote",
    "crow", "dingo", "dinosaur", "dog", "dolphin", "dragon", "duck", "dumbo octopus", "elephant",
    "ferret", "fox", "frog", "giraffe", "gopher", "grizzly", "hedgehog", "hippo", "hyena", "jackal",
    "ibex", "ifrit", "iguana", "kangaroo", "koala", "kraken", "leopard", "lemur", "liger", "lion",
    "llama", "manatee", "mink", "monkey", "narwhal", "nyan cat", "orangutan", "otter", "panda",
    "penguin", "platypus", "python", "pumpkin", "quagga", "rabbit", "raccoon", "rhino", "sheep",
    "shrew", "skunk", "slow loris", "squirrel", "tiger", "turtle", "unicorn", "walrus", "wolf",
    "wolverine", "wombat"
];

const COLORS = [
    "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4",
    "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722",
    "#795548", "#607D8B"
];

const getAnimalAvatar = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const animalIndex = Math.abs(hash) % ANIMALS.length;
    const colorIndex = Math.abs(hash >> 3) % COLORS.length; // Shift to decorrelate

    return {
        name: ANIMALS[animalIndex],
        color: COLORS[colorIndex]
    };
};

interface ExamResultViewProps {
    exam: any;
    session: any;
    questions: any[];
    total_score: number;
    analysis: {
        tag: string;
        score_earned: number;
        max_score: number;
        percentage: number;
        status: 'mastered' | 'remedial' | 'enrichment';
    }[];
    norm_reference: {
        class_average: number;
        highest_score: number;
        lowest_score: number;
        total_students: number;
        my_rank: number | string;
        percentile_rank: number;
    };
    leaderboard: {
        rank: number;
        name: string;
        avatar?: string;
        score: number;
        duration: number;
        is_me: boolean;
    }[];
}

export default function ExamResultView({
    questions,
    total_score,
    analysis,
    norm_reference,
    leaderboard
}: ExamResultViewProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'mastered': return 'bg-green-500';
            case 'enrichment': return 'bg-yellow-500'; // Gold
            case 'remedial': return 'bg-red-500';
            default: return 'bg-slate-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'mastered': return 'Kompeten';
            case 'enrichment': return 'Sangat Kompeten';
            case 'remedial': return 'Perlu Remedial';
            default: return '-';
        }
    };

    return (
        <div className="space-y-8">
            {/* Score & Ranking Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Score Card */}
                <Card className="md:col-span-2 overflow-hidden border-2 border-primary/20 shadow-md relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Trophy className="w-32 h-32" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Nilai Akhir</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 relative z-10">
                        <div className="flex items-baseline gap-1">
                            <span className="text-7xl font-black text-primary tracking-tighter">{Math.round(total_score)}</span>
                            <span className="text-2xl font-bold text-muted-foreground">/ 100</span>
                        </div>

                        <div className="flex gap-4 text-sm w-full md:w-auto">
                            <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg border border-green-100 flex-1">
                                <span className="font-bold text-green-700 text-lg">{questions.filter(q => q.is_correct).length}</span>
                                <span className="text-green-600 text-xs">Benar</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg border border-red-100 flex-1">
                                <span className="font-bold text-red-700 text-lg">{questions.filter(q => !q.is_correct && q.type !== 'essay').length}</span>
                                <span className="text-red-600 text-xs">Salah</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Rank & Stats Card */}
                <Card className="bg-slate-900 text-white shadow-md">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Medal className="w-4 h-4 text-yellow-500" /> Peringkat Kelas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold">{norm_reference.my_rank}</span>
                            <span className="text-sm text-slate-400">dari {norm_reference.total_students} Siswa</span>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-700">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Rata-rata Kelas</span>
                                <span className="font-semibold">{norm_reference.class_average}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Nilai Tertinggi</span>
                                <span className="font-semibold text-green-400">{norm_reference.highest_score}</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Badge variant="secondary" className="bg-slate-800 text-slate-200 hover:bg-slate-700 w-full justify-center py-1">
                                Top {Math.round(100 - norm_reference.percentile_rank)}%
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis & Leaderboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Mastery Analysis */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Mastery Analysis */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-blue-600" />
                                Analisis Penguasaan Materi
                            </CardTitle>
                            <CardDescription>
                                Evaluasi kekuatan dan kelemahan berdasarkan topik soal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {analysis.map((item, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="font-semibold text-slate-800">{item.tag}</div>
                                            <div className="text-xs text-muted-foreground flex gap-2 items-center mt-1">
                                                <Badge variant="outline" className={`${item.status === 'remedial' ? 'text-red-600 border-red-200 bg-red-50' : item.status === 'enrichment' ? 'text-yellow-600 border-yellow-200 bg-yellow-50' : 'text-green-600 border-green-200 bg-green-50'}`}>
                                                    {getStatusText(item.status)}
                                                </Badge>
                                                <span>{item.score_earned} / {item.max_score} Poin</span>
                                            </div>
                                        </div>
                                        <span className="font-bold text-sm">{item.percentage}%</span>
                                    </div>
                                    <Progress value={item.percentage} className="h-2" indicatorClassName={getStatusColor(item.status)} />
                                </div>
                            ))}

                            {analysis.length === 0 && (
                                <div className="text-center py-6 text-muted-foreground">
                                    Tidak ada data analisis topik tersedia.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Question Review (Existing) */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-slate-500" />
                            Review Jawaban Detail
                        </h3>
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
                                            {q.is_correct === true && <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0"><CheckCircle className="mr-1 h-3 w-3" /> Benar</Badge>}
                                            {q.is_correct === false && q.type !== 'essay' && <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 border-0"><XCircle className="mr-1 h-3 w-3" /> Salah</Badge>}
                                            {q.type === 'essay' && <Badge variant="secondary"><HelpCircle className="mr-1 h-3 w-3" /> Ditinjau</Badge>}

                                            {q.type !== 'essay' && (
                                                <Badge variant="outline" className="font-bold border-slate-300">
                                                    +{q.score_earned}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div className="prose prose-sm max-w-none">
                                        <MathRenderer content={q.content} />
                                    </div>

                                    {q.media_url && (
                                        <div className="rounded-lg overflow-hidden border max-w-md">
                                            {q.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
                                                <video controls src={q.media_url} className="w-full" />
                                            ) : (
                                                <img src={q.media_url} alt="Question media" className="w-full object-contain" />
                                            )}
                                        </div>
                                    )}

                                    <div className="grid gap-4 pt-2">
                                        <div className="rounded-md border p-3 bg-slate-50">
                                            <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Jawaban & Pembahasan</div>
                                            <div className="text-sm">
                                                <PreviewStudentAnswer
                                                    type={q.type}
                                                    options={q.options}
                                                    studentAnswer={q.student_answer}
                                                    keyAnswer={q.key_answer}
                                                    showMedia={false}
                                                    showKeyAnswer={true}
                                                    showStudentAnswer={true}
                                                />
                                            </div>

                                            {q.explanation && (
                                                <div className="mt-4 pt-4 border-t border-slate-200">
                                                    <span className="text-xs font-bold text-blue-600 uppercase mb-1 block">Penjelasan</span>
                                                    <div className="prose prose-sm text-slate-600">
                                                        <MathRenderer content={q.explanation} />
                                                    </div>
                                                </div>
                                            )}

                                            {q.correction_notes && (
                                                <div className="mt-4 pt-4 border-t border-slate-200">
                                                    <span className="text-xs font-bold text-orange-600 uppercase mb-1 flex items-center gap-1">
                                                        <MessageSquare className="w-3 h-3" />
                                                        Catatan Guru
                                                    </span>
                                                    <div className="prose prose-sm text-slate-700 bg-orange-50 p-3 rounded border border-orange-100 italic">
                                                        {q.correction_notes}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Right Column: Leaderboard */}
                <div className="space-y-6">
                    <Card className="sticky top-6">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="w-5 h-5" />
                                Leaderboard Kelas
                            </CardTitle>
                            <CardDescription className="text-blue-100">
                                Top 10 Peraih Nilai Tertinggi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px] text-center">#</TableHead>
                                        <TableHead>Siswa</TableHead>
                                        <TableHead className="text-right">Nilai</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leaderboard.map((student) => (
                                        <TableRow key={student.rank} className={student.is_me ? "bg-blue-50/50" : ""}>
                                            <TableCell className="text-center font-medium">
                                                {student.rank === 1 && <span className="text-xl">🥇</span>}
                                                {student.rank === 2 && <span className="text-xl">🥈</span>}
                                                {student.rank === 3 && <span className="text-xl">🥉</span>}
                                                {student.rank > 3 && <span className="text-slate-500">#{student.rank}</span>}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-slate-100">
                                                        <Animal
                                                            {...getAnimalAvatar(student.name)}
                                                            size="32px"
                                                            rounded
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-sm ${student.is_me ? "font-bold text-blue-700" : "font-medium"}`}>
                                                            {student.name} {student.is_me && "(Anda)"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-bold">
                                                {student.score}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {leaderboard.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                                                Belum ada data
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="bg-slate-50 text-xs text-muted-foreground p-3 border-t">
                            * Peringkat berdasarkan nilai tertinggi & durasi pengerjaan tercepat.
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
