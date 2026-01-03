import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckCircle, Save, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { index as examsIndexRoute } from '@/routes/admin/exams';
import ExamManualCorrectionController from '@/actions/App/Http/Controllers/Admin/ExamManualCorrectionController';
import ExamController from '@/actions/App/Http/Controllers/Admin/ExamController';
import MathRenderer from '@/components/app/questions/MathRenderer';
import PreviewStudentAnswer from "@/components/app/questions/results/PreviewStudentAnswer";
import RichTextEditor from '@/components/ui/rich-text/RichTextEditor';

interface Question {
    id: string;
    question_number: number;
    question_type: string;
    content: string;
    options: any;
    score_value: number;
    key_answer: any;
}

interface AnswerDetail {
    id: string;
    student_name: string;
    student_email: string;
    exam_session_id: string;
    attempt_number: number;
    student_answer: any;
    score_earned: number;
    correction_notes: string | null;
    is_correct: boolean;
    answered_at: string;
}

interface PageProps {
    exam: {
        id: string;
        title: string;
    };
    questions: Question[];
    selectedQuestion: Question | null;
    answers: AnswerDetail[];
}

export default function ManualCorrectionPage({ exam, questions, selectedQuestion, answers: initialAnswers }: PageProps) {
    // We use local state for answers ONLY to allow optimistic UI updates while typing scores.
    // Ideally, we might just trust the props, but for inputs we need binding.
    const [answers, setAnswers] = useState<AnswerDetail[]>(initialAnswers);

    // Update local answers when prop changes (new question selected)
    useEffect(() => {
        setAnswers(initialAnswers);
    }, [initialAnswers]);

    // Bulk Score State
    const [bulkScore, setBulkScore] = useState<string>('');
    const [loadingAnswers, setLoadingAnswers] = useState(false); // Used for saving state now
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Reset selection when question changes
    useEffect(() => {
        setSelectedIds([]);
    }, [selectedQuestion?.id]);

    // Navigation Handler
    const handleQuestionSelect = (q: Question) => {
        router.get(
            ExamManualCorrectionController.index({ exam: exam.id }).url,
            { question_id: q.id },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['selectedQuestion', 'answers'],
                onStart: () => setLoadingAnswers(true),
                onFinish: () => setLoadingAnswers(false),
            }
        );
    };

    const handleScoreChange = (id: string, val: string) => {
        setAnswers(prev => prev.map(a => a.id === id ? { ...a, score_earned: parseFloat(val) || 0 } : a));
    };

    const handleNotesChange = (id: string, val: string) => {
        setAnswers(prev => prev.map(a => a.id === id ? { ...a, correction_notes: val } : a));
    };

    const saveScore = async (answer: AnswerDetail) => {
        try {
            await axios.post(ExamManualCorrectionController.storeScore().url, {
                detail_id: answer.id,
                score: answer.score_earned,
                notes: answer.correction_notes
            });
            toast.success("Score saved");
            // Optimistically updated already, no need to refetch unless needed
        } catch (error) {
            toast.error("Failed to save score");
            console.error(error);
        }
    };

    const applyBulkScore = () => {
        const score = parseFloat(bulkScore);
        if (isNaN(score)) return;

        if (selectedIds.length === 0) {
            toast.error("Please select at least one student to apply bulk score");
            return;
        }

        // Update local state for selected answers only
        setAnswers(prev => prev.map(a =>
            selectedIds.includes(a.id) ? { ...a, score_earned: score } : a
        ));

        toast.success(`Applied score ${score} to ${selectedIds.length} students`);
    };

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(answers.map(a => a.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
    };

    const saveAllScores = async () => {
        try {
            const payload = answers.map(a => ({
                detail_id: a.id,
                score: a.score_earned,
                notes: a.correction_notes
            }));

            await axios.post(ExamManualCorrectionController.bulkStoreScore().url, {
                scores: payload
            });
            toast.success("All scores saved successfully");
        } catch (error) {
            toast.error("Failed to save all scores");
            console.error(error);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'ESSAY': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'MULTIPLE_CHOICE': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Exams', href: examsIndexRoute.url() },
            { title: exam.title, href: ExamController.monitor({ exam: exam.id }).url },
            { title: 'Manual Correction', href: '#' }
        ]}>
            <Head title={`Correction - ${exam.title}`} />

            <div className="h-[calc(100vh-4rem)] flex flex-col">
                {/* Header */}
                <header className="border-b bg-background px-6 py-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={ExamController.monitor({ exam: exam.id }).url}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-lg font-semibold">{exam.title}</h1>
                            <p className="text-sm text-muted-foreground">Manual Correction Mode</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={saveAllScores} disabled={loadingAnswers}>
                            <Save className="mr-2 h-4 w-4" /> Save All
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden flex">
                    {/* Left Column: Questions List */}
                    <aside className="w-1/4 max-w-sm border-r bg-muted/10 flex flex-col">
                        <div className="p-4 border-b font-medium bg-background/50 backdrop-blur">
                            Questions ({questions.length})
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {questions.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">No questions found.</div>
                            ) : (
                                questions.map((q) => (
                                    <div
                                        key={q.id}
                                        onClick={() => handleQuestionSelect(q)}
                                        className={cn(
                                            "cursor-pointer rounded-lg border p-4 transition-all hover:bg-accent",
                                            selectedQuestion?.id === q.id ? "bg-accent border-primary ring-1 ring-primary" : "bg-card"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-sm">No. {q.question_number}</span>
                                            <Badge variant="outline" className={getTypeColor(q.question_type)}>
                                                {q.question_type}
                                            </Badge>
                                        </div>
                                        <MathRenderer
                                            content={q.content}
                                            className="text-xs text-muted-foreground line-clamp-3 prose prose-sm dark:prose-invert"
                                        />
                                        <div className="mt-2 text-xs font-medium text-right text-muted-foreground">
                                            Max Score: {q.score_value}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </aside>

                    {/* Right Column: Answers List */}
                    <main className="flex-1 flex flex-col bg-background">
                        {selectedQuestion ? (
                            <>
                                <div className="p-4 border-b flex items-center justify-between bg-muted/10">
                                    <h2 className="font-semibold flex items-center gap-2">
                                        Grading Question #{selectedQuestion.question_number}
                                        <Badge variant="secondary">Max: {selectedQuestion.score_value}</Badge>
                                    </h2>

                                    {/* Bulk Actions */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="select-all"
                                                checked={answers.length > 0 && selectedIds.length === answers.length}
                                                onCheckedChange={(c) => toggleSelectAll(!!c)}
                                            />
                                            <label htmlFor="select-all" className="text-sm font-medium leading-none cursor-pointer">
                                                Select All
                                            </label>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">Bulk Score:</span>
                                            <Input
                                                type="number"
                                                className="w-20 h-8"
                                                value={bulkScore}
                                                onChange={(e) => setBulkScore(e.target.value)}
                                                placeholder="Score"
                                            />
                                            <Button size="sm" variant="secondary" onClick={applyBulkScore} disabled={selectedIds.length === 0}>
                                                Apply to Selected ({selectedIds.length})
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {/* Full Question Display */}
                                    <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                                        <CardHeader>
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                                    {selectedQuestion.question_number}
                                                </span>
                                                Question Content
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <RichTextEditor
                                                value={selectedQuestion.content}
                                                readOnly={true}
                                                className="prose prose-sm dark:prose-invert max-w-none"
                                            />
                                        </CardContent>
                                    </Card>
                                    {loadingAnswers ? (
                                        <div className="text-center py-10">Loading answers...</div>
                                    ) : answers.length === 0 ? (
                                        <div className="text-center py-10 text-muted-foreground px-4">
                                            <AlertCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                            No answers found for this question yet.
                                        </div>
                                    ) : (
                                        answers.map((answer) => (
                                            <Card key={answer.id} className={cn("transition-colors", selectedIds.includes(answer.id) ? "border-primary/50 bg-primary/5" : "")}>
                                                <CardContent className="p-4 flex gap-4">
                                                    {/* Selection Checkbox */}
                                                    <div className="pt-1">
                                                        <Checkbox
                                                            checked={selectedIds.includes(answer.id)}
                                                            onCheckedChange={(c) => toggleSelectOne(answer.id, !!c)}
                                                        />
                                                    </div>

                                                    {/* Student Info & Answer */}
                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-medium">{answer.student_name}</div>
                                                            <div className="text-xs text-muted-foreground">({answer.student_email})</div>
                                                            <Badge variant="outline" className="text-xs">Upaya ke-{answer.attempt_number}</Badge>
                                                        </div>

                                                        {/* Answer Content */}
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="text-sm font-medium text-muted-foreground">Student Answer:</div>
                                                            </div>

                                                            {!answer.student_answer && (
                                                                <div className="p-4 rounded-md bg-muted/30 border text-sm text-muted-foreground italic mb-4">
                                                                    No answer provided
                                                                </div>
                                                            )}

                                                            {/* {console.log('DEBUG OPTION RENDER:', {
                                                                questionType: selectedQuestion.question_type,
                                                                options: selectedQuestion.options,
                                                                studentAnswer: answer.student_answer,
                                                                answerType: typeof answer.student_answer
                                                            })} */}

                                                            {(() => {
                                                                // Sanitize Answer Logic
                                                                let sanitizedValue = answer.student_answer;

                                                                // Handle potential double-serialization or quoted strings
                                                                if (typeof sanitizedValue === 'string') {
                                                                    // Check if it's a JSON string representative (e.g. "\"A\"" or "[\"A\"]")
                                                                    try {
                                                                        const parsed = JSON.parse(sanitizedValue);
                                                                        sanitizedValue = parsed;
                                                                    } catch (e) {
                                                                        // If regular string with quotes, strip them
                                                                        if (sanitizedValue.startsWith('"') && sanitizedValue.endsWith('"')) {
                                                                            sanitizedValue = sanitizedValue.slice(1, -1);
                                                                        }
                                                                    }
                                                                }

                                                                return (
                                                                    <PreviewStudentAnswer
                                                                        type={selectedQuestion.question_type}
                                                                        options={selectedQuestion.options}
                                                                        studentAnswer={sanitizedValue}
                                                                        keyAnswer={selectedQuestion.key_answer}
                                                                        showMedia={false}
                                                                        showKeyAnswer={true}
                                                                        showStudentAnswer={true}
                                                                    />
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>

                                                    {/* Scoring Controls */}
                                                    <div className="w-[300px] border-l pl-6 space-y-4 flex flex-col">
                                                        <div className="space-y-2">
                                                            <Label>Score (Max: {selectedQuestion.score_value})</Label>
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    type="number"
                                                                    value={answer.score_earned}
                                                                    onChange={(e) => handleScoreChange(answer.id, e.target.value)}
                                                                />
                                                                <Button size="icon" variant="ghost" onClick={() => saveScore(answer)}>
                                                                    <Save className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {Array.from({ length: selectedQuestion.score_value }, (_, i) => i + 1).map((score) => (
                                                                    <Button
                                                                        key={score}
                                                                        type="button"
                                                                        size="sm"
                                                                        variant={answer.score_earned === score ? "default" : "outline"}
                                                                        className="h-7 w-7 p-0 text-xs"
                                                                        onClick={() => handleScoreChange(answer.id, score.toString())}
                                                                    >
                                                                        {score}
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Notes</Label>
                                                            <Textarea
                                                                placeholder="Feedback..."
                                                                className="h-20 resize-none text-xs"
                                                                value={answer.correction_notes || ''}
                                                                onChange={(e) => handleNotesChange(answer.id, e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                                Select a question to start grading
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}
