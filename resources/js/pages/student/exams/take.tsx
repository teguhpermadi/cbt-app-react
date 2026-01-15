
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    Flag,
    CheckCircle2,
    AlertCircle,
    Menu,
    Save,
    Lightbulb // Added
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import axios from 'axios';
import { saveAnswer as saveAnswerRoute, finish as finishRoute } from '@/routes/student/exams';
import OptionViewer from '@/components/app/questions/option-viewers/OptionViewer';
import ImageViewerModal from '@/components/ui/image-viewer-modal';
import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/dist/contrib/auto-render';

interface Question {
    id: string; // ExamQuestion ID
    detail_id: string; // ExamResultDetail ID
    number: number;
    content: string;
    type: string;
    options: any; // Can be array or object depending on type
    student_answer: any;
    is_flagged: boolean;
    media_url?: string;
    hint?: string; // Added
}

interface Props {
    exam: {
        id: string;
        title: string;
        duration: number;
        timer_type: 'strict' | 'flexible';
        is_hint_visible: boolean; // Added
    };
    session: {
        id: string;
        end_time: string | null;
    };
    questions: Question[];
}

export default function ExamTake({ exam, session, questions }: Props) {
    // -- State --
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [flagged, setFlagged] = useState<Record<string, boolean>>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [viewingImage, setViewingImage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hintVisible, setHintVisible] = useState(false); // Added state for hint visibility

    const handleImageClick = (src: string) => {
        setViewingImage(src);
        setImageViewerOpen(true);
    };

    // Time Tracking
    const activeQuestionStartTime = useRef<number>(Date.now());

    // Ref for rendering math formulas
    const contentRef = useRef<HTMLDivElement>(null);

    // Safeguard: Check if questions exist
    if (!questions || questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Card className="w-full max-w-md text-center p-6">
                    <CardHeader>
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <CardTitle>Ujian Tidak Tersedia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Maaf, sepertinya soal ujian gagal dimuat atau belum tersedia untuk ujian ini.
                        </p>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <Button onClick={() => window.location.reload()}>Refresh Halaman</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // Initialize state from props
    useEffect(() => {
        const initialAnswers: Record<string, any> = {};
        const initialFlags: Record<string, boolean> = {};

        questions.forEach(q => {
            if (q.student_answer !== null && q.student_answer !== undefined && q.student_answer !== 'null') {
                initialAnswers[q.detail_id] = q.student_answer;
            }
            initialFlags[q.detail_id] = q.is_flagged;
        });

        setAnswers(initialAnswers);
        setFlagged(initialFlags);

        activeQuestionStartTime.current = Date.now();

        // Only initialize timer for strict timer type
        if (exam.timer_type === 'strict' && session.end_time) {
            const end = new Date(session.end_time).getTime();
            const now = new Date().getTime();
            setTimeLeft(Math.max(0, Math.floor((end - now) / 1000)));
        }

    }, [questions, session.end_time, exam.timer_type]);

    // Render math formulas when question content changes
    useEffect(() => {
        if (contentRef.current) {
            // Clear previous content first
            contentRef.current.innerHTML = questions[currentIndex]?.content || '';

            // Then render math
            renderMathInElement(contentRef.current, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });

            // Make images clickable
            const images = contentRef.current.getElementsByTagName('img');
            Array.from(images).forEach((img) => {
                img.style.cursor = 'pointer';
                img.onclick = () => handleImageClick(img.src);
            });
        }
    }, [currentIndex, questions[currentIndex]?.content]);

    // Timer Interval - only for strict timer type
    useEffect(() => {
        if (exam.timer_type !== 'strict') return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // AUTO SUBMIT
                    if (!isSubmitting) {
                        setIsSubmitting(true);
                        router.post(finishRoute.url({ exam: exam.id }), {}, {
                            onFinish: () => setIsSubmitting(false)
                        });
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
        return () => clearInterval(timer);
    }, [exam.id, isSubmitting, exam.timer_type]);

    // Presence Channel Join
    useEffect(() => {
        const channelName = `exam.presence.${exam.id}`;
        if ((window as any).Echo) {
            (window as any).Echo.join(channelName)
                .here((users: any) => {
                    // console.log('Presence here', users);
                })
                .joining((user: any) => {
                    // console.log('Presence joining', user);
                })
                .leaving((user: any) => {
                    // console.log('Presence leaving', user);
                });
        }

        return () => {
            if ((window as any).Echo) {
                (window as any).Echo.leave(channelName);
            }
        }
    }, [exam.id]);

    // Format time
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Check if all questions are answered
    const isAllAnswered = questions.every(q => {
        const ans = answers[q.detail_id];
        if (ans === null || ans === undefined || ans === 'null') return false;
        if (typeof ans === 'string') return ans.trim() !== '';
        if (Array.isArray(ans)) return ans.length > 0;
        if (typeof ans === 'object') return Object.keys(ans).length > 0;
        return true;
    });

    // -- Actions --

    // Autosave & Track Time function
    const saveToDB = useCallback(async (detailId: string, payload: any, forceDuration: boolean = false) => {
        const now = Date.now();
        const durationMs = now - activeQuestionStartTime.current;
        const durationSec = Math.round(durationMs / 1000);

        if (durationSec < 0 && !forceDuration) return;

        // Reset start time immediately to avoid double counting
        activeQuestionStartTime.current = now;

        console.log('Sending autosave:', { detailId, payload, durationSec }); // DEBUG LOG

        try {
            await axios.post(saveAnswerRoute.url({ exam: exam.id }), {
                detail_id: detailId,
                duration: durationSec,
                ...payload
            });
            console.log('Autosave success'); // DEBUG LOG
        } catch (error) {
            console.error("Autosave failed", error);
        }
    }, [exam.id]);


    // Handle Answer Change
    const handleAnswerChange = (value: any) => {
        console.log('Answer Changed:', value); // DEBUG LOG
        const currentQ = questions[currentIndex];

        setAnswers(prev => ({
            ...prev,
            [currentQ.detail_id]: value
        }));

        saveToDB(currentQ.detail_id, { answer: value });
    };

    // Handle Toggle Flag
    const handleToggleFlag = () => {
        const currentQ = questions[currentIndex];
        const newFlagState = !flagged[currentQ.detail_id];

        setFlagged(prev => ({
            ...prev,
            [currentQ.detail_id]: newFlagState
        }));

        saveToDB(currentQ.detail_id, { is_flagged: newFlagState });
    };

    // Handle Navigation
    const changeQuestion = (index: number) => {
        if (index < 0 || index >= questions.length) return;

        const currentQ = questions[currentIndex];
        const currentAns = answers[currentQ.detail_id];
        const currentFlag = flagged[currentQ.detail_id];

        // Save current state + time spent on current question
        saveToDB(currentQ.detail_id, {
            answer: currentAns ?? null,
            is_flagged: currentFlag
        });

        // Switch to new question
        // Switch to new question
        setCurrentIndex(index);
        setHintVisible(false); // Reset hint visibility
    };

    // Render Question Options - Delegates to OptionViewer
    const renderOptions = (question: Question) => {
        return (
            <OptionViewer
                type={question.type}
                options={question.options}
                value={answers[question.detail_id]}
                onChange={handleAnswerChange}
            />
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <Head title={`Ujian: ${exam.title}`} />

            {/* Header */}
            <header className="sticky top-0 z-30 w-full border-b bg-white dark:bg-slate-900 shadow-sm">
                <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="font-bold text-base md:text-lg truncate max-w-[150px] md:max-w-md text-slate-800 dark:text-slate-100">
                            {exam.title}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {exam.timer_type === 'strict' && (
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full font-mono font-bold text-sm md:text-xl border shadow-sm",
                                timeLeft < 300 ? "bg-red-50 text-red-600 border-red-200 animate-pulse" : "bg-slate-100 text-slate-700 border-slate-200"
                            )}>
                                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                                {formatTime(timeLeft)}
                            </div>
                        )}

                        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="md:hidden">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 flex flex-col bg-slate-50 dark:bg-slate-900">
                                <div className="px-5 py-4 border-b bg-white dark:bg-slate-900">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <Menu className="w-5 h-5" />
                                        Navigasi Soal
                                    </h2>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {Object.keys(answers).length} dari {questions.length} soal terjawab
                                    </p>
                                </div>

                                <div className="flex-1 overflow-hidden p-5 bg-white dark:bg-slate-900">
                                    <QuestionNavigator
                                        questions={questions}
                                        currentIndex={currentIndex}
                                        answers={answers}
                                        flagged={flagged}
                                        onSelect={(idx) => {
                                            changeQuestion(idx);
                                            setIsSidebarOpen(false);
                                        }}
                                        className="h-full pr-2"
                                    />
                                </div>

                                <div className="p-5 border-t bg-slate-50 dark:bg-slate-800/50 space-y-4">
                                    <QuestionStatusLegend
                                        answers={answers}
                                        questions={questions}
                                        flagged={flagged}
                                    />

                                    <Separator />

                                    <Button
                                        className={cn(
                                            "w-full font-bold",
                                            isAllAnswered ? "bg-green-600 hover:bg-green-700 text-white" : "bg-slate-300 text-slate-500 cursor-not-allowed"
                                        )}
                                        disabled={!isAllAnswered || isSubmitting}
                                        onClick={() => {
                                            setIsSidebarOpen(false);
                                            if (confirm("Selesaikan ujian sekarang?")) {
                                                setIsSubmitting(true);
                                                router.post(finishRoute.url({ exam: exam.id }), {}, {
                                                    onFinish: () => setIsSubmitting(false)
                                                });
                                            }
                                        }}
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Selesai & Kumpulkan
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            <div className="flex-1 container mx-auto px-4 py-4 md:py-6 flex gap-6 max-w-7xl">
                {/* Main Content */}
                <main className="flex-1 w-full min-w-0">
                    <Card className="h-full flex flex-col shadow-md border-slate-200 dark:border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-white dark:bg-slate-900 sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="text-sm md:text-base px-3 md:px-4 py-1 font-bold bg-slate-100 text-slate-700 border-slate-200">
                                    SOAL NO. {currentIndex + 1}
                                </Badge>
                            </div>
                        </CardHeader>

                        <ScrollArea className="flex-1 bg-white dark:bg-slate-900">
                            <CardContent className="p-4 md:p-10 space-y-6 md:space-y-10">
                                {/* Question Content */}
                                <div className="text-base md:text-lg leading-relaxed text-slate-800 dark:text-slate-200" key={`question-content-${currentIndex}`}>
                                    {questions[currentIndex].media_url && (
                                        <div className="mb-6">
                                            <img
                                                src={questions[currentIndex].media_url}
                                                alt="Question Media"
                                                className="max-h-[200px] md:max-h-[300px] w-auto rounded-lg border shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
                                                onClick={() => handleImageClick(questions[currentIndex].media_url!)}
                                            />
                                        </div>
                                    )}
                                    <div ref={contentRef} className="exam-content" />
                                </div>

                                <Separator className="bg-slate-100 dark:bg-slate-800" />

                                {/* Options */}
                                <div className="space-y-4">
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Pilih Jawaban:</p>
                                    {renderOptions(questions[currentIndex])}
                                </div>

                                {/* HINT SECTION */}
                                {exam.is_hint_visible && questions[currentIndex].hint && (
                                    <div className="mt-8 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col gap-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setHintVisible(!hintVisible)}
                                                className="self-start gap-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:text-yellow-500 dark:hover:text-yellow-400 dark:hover:bg-yellow-950/20"
                                            >
                                                <Lightbulb className={cn("w-4 h-4", hintVisible ? "fill-current" : "")} />
                                                {hintVisible ? "Sembunyikan Bantuan" : "Lihat Bantuan (Hint)"}
                                            </Button>

                                            {hintVisible && (
                                                <div className="bg-yellow-50 dark:bg-yellow-950/10 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4 text-sm text-slate-700 dark:text-slate-300 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="flex gap-2">
                                                        <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                                        <div
                                                            className="prose prose-sm dark:prose-invert max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: questions[currentIndex].hint }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </ScrollArea>

                        <CardFooter className="border-t p-4 md:p-6 flex items-center justify-between gap-3 bg-white dark:bg-slate-900 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => changeQuestion(currentIndex - 1)}
                                disabled={currentIndex === 0 || isSubmitting}
                                className="flex-1 sm:flex-none gap-2 bg-white"
                            >
                                <ChevronLeft className="w-5 h-5 text-slate-600" />
                                <span className="hidden sm:inline">Sebelumnya</span>
                            </Button>

                            <Button
                                variant={flagged[questions[currentIndex].detail_id] ? "default" : "secondary"}
                                size="lg"
                                onClick={handleToggleFlag}
                                disabled={isSubmitting}
                                className={cn(
                                    "flex-1 sm:flex-none gap-2",
                                    flagged[questions[currentIndex].detail_id]
                                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                                )}
                            >
                                <Flag className={cn("w-4 h-4", flagged[questions[currentIndex].detail_id] && "fill-current")} />
                                <span className="hidden sm:inline">{flagged[questions[currentIndex].detail_id] ? "Ragu-ragu Is On" : "Tandai Ragu-ragu"}</span>
                                <span className="sm:hidden">Ragu</span>
                            </Button>

                            {currentIndex === questions.length - 1 ? (
                                <Button
                                    size="lg"
                                    className={cn(
                                        "flex-1 sm:flex-none gap-2 font-bold",
                                        isAllAnswered ? "bg-green-600 hover:bg-green-700 text-white" : "bg-slate-300 text-slate-500 cursor-not-allowed"
                                    )}
                                    disabled={!isAllAnswered || isSubmitting}
                                    onClick={() => {
                                        if (confirm("Apakah Anda yakin ingin menyelesaikan ujian ini?")) {
                                            setIsSubmitting(true);
                                            router.post(finishRoute.url({ exam: exam.id }), {}, {
                                                onFinish: () => setIsSubmitting(false)
                                            });
                                        }
                                    }}
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="hidden sm:inline">{isAllAnswered ? (isSubmitting ? "Menyimpan..." : "Selesai & Kumpulkan") : "Jawab Semua"}</span>
                                    <span className="sm:hidden">Selesai</span>
                                </Button>
                            ) : (
                                <Button
                                    size="lg"
                                    onClick={() => changeQuestion(currentIndex + 1)}
                                    disabled={isSubmitting}
                                    className="flex-1 sm:flex-none gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <span className="hidden sm:inline">Selanjutnya</span>
                                    <span className="sm:hidden">Lanjut</span>
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </main>

                {/* Sidebar (Desktop) */}
                <aside className="hidden lg:block w-80 shrink-0">
                    <div className="sticky top-24">
                        <Card className="border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
                            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b py-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <Menu className="w-4 h-4" />
                                        Navigasi Soal
                                    </CardTitle>
                                    <Badge variant="outline" className="bg-white dark:bg-slate-900">
                                        {Object.keys(answers).length}/{questions.length}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5">
                                <QuestionNavigator
                                    questions={questions}
                                    currentIndex={currentIndex}
                                    answers={answers}
                                    flagged={flagged}
                                    onSelect={changeQuestion}
                                    className="h-[350px] pr-2"
                                />
                            </CardContent>
                            <CardFooter className="border-t p-5 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col gap-4">
                                <QuestionStatusLegend
                                    answers={answers}
                                    questions={questions}
                                    flagged={flagged}
                                />

                                <Separator className="my-1" />

                                <Button
                                    className={cn(
                                        "w-full font-bold h-11",
                                        isAllAnswered ? "bg-green-600 hover:bg-green-700 text-white" : "bg-slate-300 text-slate-500 cursor-not-allowed"
                                    )}
                                    disabled={!isAllAnswered || isSubmitting}
                                    onClick={() => {
                                        if (confirm("Selesaikan ujian sekarang?")) {
                                            setIsSubmitting(true);
                                            router.post(finishRoute.url({ exam: exam.id }), {}, {
                                                onFinish: () => setIsSubmitting(false)
                                            });
                                        }
                                    }}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {isAllAnswered ? (isSubmitting ? "Menyimpan..." : "Akhiri Ujian") : "Jawab Semua Soal"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </aside>
            </div>

            {/* Image Viewer Modal */}
            <ImageViewerModal
                src={viewingImage}
                isOpen={imageViewerOpen}
                onClose={() => setImageViewerOpen(false)}
            />
        </div>
    );
}

// Subcomponent for Grid
function QuestionNavigator({ questions, currentIndex, answers, flagged, onSelect, className }: {
    questions: Question[],
    currentIndex: number,
    answers: Record<string, any>,
    flagged: Record<string, boolean>,
    onSelect: (index: number) => void,
    className?: string
}) {
    return (
        <ScrollArea className={cn("h-full", className)}>
            <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                    const ans = answers[q.detail_id];
                    let isAnswered = false;
                    if (ans !== null && ans !== undefined && ans !== 'null') {
                        if (typeof ans === 'string') isAnswered = ans.trim() !== '';
                        else if (Array.isArray(ans)) isAnswered = ans.length > 0;
                        else if (typeof ans === 'object') isAnswered = Object.keys(ans).length > 0;
                        else isAnswered = true; // numbers, booleans
                    }
                    const isFlagged = flagged[q.detail_id];
                    const isActive = idx === currentIndex;

                    return (
                        <button
                            key={q.detail_id}
                            onClick={() => onSelect(idx)}
                            className={cn(
                                "h-10 w-full rounded-md text-sm font-bold transition-all border flex items-center justify-center relative",
                                isActive
                                    ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/20"
                                    : isFlagged
                                        ? "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200"
                                        : isAnswered
                                            ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                            : "bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                            )}
                        >
                            {idx + 1}
                            {isFlagged && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border border-white flex items-center justify-center">
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </ScrollArea>
    );
}

// Subcomponent for Status Legend
function QuestionStatusLegend({ answers, questions, flagged }: {
    answers: Record<string, any>,
    questions: Question[],
    flagged: Record<string, boolean>
}) {
    const answeredCount = Object.keys(answers).length;
    const flaggedCount = Object.values(flagged).filter(Boolean).length;
    const unansweredCount = questions.length - answeredCount;

    return (
        <div className="w-full space-y-3">
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-50 border border-blue-200"></div>
                    <span className="text-slate-600 dark:text-slate-400">Terjawab</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{answeredCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300"></div>
                    <span className="text-slate-600 dark:text-slate-400">Ragu-ragu</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{flaggedCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-white border border-slate-200 dark:bg-slate-800"></div>
                    <span className="text-slate-600 dark:text-slate-400">Belum Dijawab</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{unansweredCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-600"></div>
                    <span className="text-slate-600 dark:text-slate-400">Sedang Dikerjakan</span>
                </div>
            </div>
        </div>
    );
}
