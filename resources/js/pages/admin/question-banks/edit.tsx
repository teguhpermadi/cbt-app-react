import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';
import InputError from '@/components/input-error';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, Settings, Sparkles, Loader2, FileText, Globe, Lock, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'; // Added icons
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Added Tabs
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'; // Added Dropdown
import { FormEventHandler } from 'react';
import { useDebounce } from 'use-debounce';

// Wayground Imports
// Wayground Imports
// import { index } from '@/routes/admin/question-banks'; // Removed invalid import
import QuestionBankController from '@/actions/App/Http/Controllers/Admin/QuestionBankController';
import QuestionController from '@/actions/App/Http/Controllers/Admin/QuestionController';
import ExamController from '@/actions/App/Http/Controllers/Admin/ExamController';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { SortableQuestionCard } from '@/components/app/questions/SortableQuestionCard';
import QuestionCard from '@/components/app/questions/QuestionCard';
import { Question } from '@/components/app/questions/types';
import { UploadQuestionsModal } from '@/components/admin/question-banks/upload-questions-modal';
import { TimerTypeSelector } from '@/components/app/timer-type-selector';
import QuestionNavigation from '@/components/app/questions/QuestionNavigation';




import 'katex/dist/katex.min.css';
import ReadingMaterialController from '@/actions/App/Http/Controllers/Admin/ReadingMaterialController';

interface QuestionBank {
    id: number;
    name: string;
    subject_id: number;
    description: string | null;
    is_public: boolean;
    subject?: {
        id: number;
        name: string;
        grade?: {
            id: number;
            name: string;
        };
    };
    teacher?: {
        id: number;
        name: string;
        email: string;
    };
}

interface Subject {
    id: number;
    name: string;
}

interface CreateExamFormData {
    academic_year_id: string;
    grade_ids: string[];
    subject_id: string;
    teacher_id: string;
    question_bank_id: string;
    title: string;
    exam_type: string;
    duration: number;
    is_published: boolean;
    is_randomized: boolean;
    is_answer_randomized: boolean;
    is_hint_visible: boolean;
    show_result_on_finish: boolean;
    max_attempts: number | null;
    timer_type: string;
    passing_score: number;
    start_time: string;
    end_time: string;
}

interface EditProps {
    questionBank: QuestionBank;
    readingMaterials?: any[]; // Added
}

export default function Edit({ questionBank, questions = [], subjects, readingMaterials = [] }: EditProps) {
    // Get query param for active tab
    const queryParams = new URLSearchParams(window.location.search);
    const defaultTab = queryParams.get('tab') || 'questions';

    const { data, setData, put, processing, errors, isDirty } = useForm({
        name: questionBank.name,
        subject_id: questionBank.subject_id,
        description: questionBank.description || '',
        is_public: questionBank.is_public,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Using Wayground Action
        put(QuestionBankController.update(questionBank.id).url);
    };

    // AI Generation State
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStartCount, setGenerationStartCount] = useState(0);
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

    const aiForm = useForm({
        topic: '',
        question_type: 'multiple_choice',
        count: 5,
        difficulty: 'sedang',
    });

    // READING MATERIAL STATE
    const [isCreateReaderOpen, setIsCreateReaderOpen] = useState(false);
    const readerForm = useForm({
        question_bank_id: questionBank.id,
        title: '',
        type: 'text', // 'text' or 'file' (UI only, backend handles content/file check)
    });

    const submitCreateReader = (e: React.FormEvent) => {
        e.preventDefault();
        readerForm.post(ReadingMaterialController.store().url, {
            onSuccess: () => {
                setIsCreateReaderOpen(false);
                readerForm.reset();
            }
        });
    };

    // Tag Generation State
    const [isGeneratingTags, setIsGeneratingTags] = useState(false);

    // Polling function to check for new questions
    const checkForNewQuestions = () => {
        router.reload({
            only: ['questions'],
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page: any) => {
                const currentQuestions = page.props.questions || [];
                if (currentQuestions.length > generationStartCount) {
                    // New questions detected, stop polling
                    setIsGenerating(false);
                    if (pollingInterval) {
                        clearInterval(pollingInterval);
                        setPollingInterval(null);
                    }
                }
            }
        });
    };

    // Clean up polling on unmount
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    const submitAIGeneration: FormEventHandler = (e) => {
        e.preventDefault();

        // Record current question count
        setGenerationStartCount(questions.length);
        setIsGenerating(true);

        aiForm.post(`/admin/question-banks/${questionBank.id}/generate-ai`, {
            preserveScroll: true,
            onSuccess: () => {
                aiForm.reset();

                // Start polling every 3 seconds
                const interval = setInterval(checkForNewQuestions, 3000);
                setPollingInterval(interval);

                // Auto-stop polling after 5 minutes as safety measure
                setTimeout(() => {
                    setIsGenerating(false);
                    if (interval) {
                        clearInterval(interval);
                        setPollingInterval(null);
                    }
                }, 300000); // 5 minutes
            },
            onError: () => {
                setIsGenerating(false);
            }
        });
    };

    const handleGenerateTags = () => {
        if (questions.length === 0) {
            return;
        }

        setIsGeneratingTags(true);
        router.post(`/admin/question-banks/${questionBank.id}/generate-tags`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Start polling for tag updates
                const interval = setInterval(() => {
                    router.reload({
                        only: ['questions'],
                        preserveScroll: true,
                        preserveState: true,
                    });
                }, 3000);

                // Stop polling after 5 minutes
                setTimeout(() => {
                    setIsGeneratingTags(false);
                    clearInterval(interval);
                }, 300000);
            },
            onError: () => {
                setIsGeneratingTags(false);
            },
        });
    };

    const scrollToQuestion = (index: number) => {
        const element = document.getElementById(`question-index-${index}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Provide visual feedback
            const cardElement = element.querySelector('.question-card-inner') || element;
            cardElement.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
            setTimeout(() => cardElement.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'), 2000);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Create Exam State
    const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Helper untuk format datetime-local input
    const getDefaultStartTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    };

    const getDefaultEndTime = () => {
        const now = new Date();
        now.setDate(now.getDate() + 1); // 24 jam dari sekarang
        return now.toISOString().slice(0, 16);
    };

    const createForm = useForm<CreateExamFormData>({
        academic_year_id: '',
        grade_ids: questionBank.subject?.grade?.id ? [questionBank.subject.grade.id.toString()] : [],
        subject_id: questionBank.subject_id.toString(),
        teacher_id: questionBank.teacher?.id?.toString() || '',
        question_bank_id: questionBank.id.toString(),
        title: questionBank.name,
        exam_type: 'daily',
        duration: 60,
        is_published: true,
        is_randomized: true,
        is_answer_randomized: false,
        is_hint_visible: false,
        show_result_on_finish: true,
        max_attempts: null,
        timer_type: 'flexible',
        passing_score: 70,
        start_time: getDefaultStartTime(),
        end_time: getDefaultEndTime(),
    });

    const loadFormData = async () => {
        setLoading(true);
        try {
            const response = await fetch(ExamController.create.url());
            const data = await response.json();
            setFormData(data);

            // Set academic year pertama yang active
            const activeAcademicYear = data.academicYears.find((ay: any) => ay.is_active);
            if (activeAcademicYear) {
                createForm.setData('academic_year_id', activeAcademicYear.id.toString());
            }
        } catch (error) {
            console.error('Failed to load form data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Quick duration buttons
    const setQuickDuration = (days: number) => {
        const startTime = new Date(createForm.data.start_time);
        const endTime = new Date(startTime);
        endTime.setDate(endTime.getDate() + days);
        createForm.setData('end_time', endTime.toISOString().slice(0, 16));
    };

    const handleOpenCreateExam = () => {
        setIsCreateExamOpen(true);
        if (!formData) {
            loadFormData();
        }
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(ExamController.store.url(), {
            onSuccess: (page: any) => {
                setIsCreateExamOpen(false);
                createForm.reset();
                // Redirect to monitor page of the newly created exam
                const examId = page.props.exam?.id;
                if (examId) {
                    router.visit(ExamController.monitor(examId).url);
                } else {
                    router.visit(ExamController.index().url);
                }
            },
        });
    };

    const [sortedQuestions, setSortedQuestions] = useState(questions);

    useEffect(() => {
        setSortedQuestions(questions);
    }, [questions]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const scrollToId = params.get('scrollTo');
        if (scrollToId) {
            setTimeout(() => {
                const element = document.getElementById(scrollToId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Provide visual feedback
                    element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                    setTimeout(() => element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'), 2000);

                    // Clean up query param
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                }
            }, 500);
        }
    }, [questions]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setSortedQuestions((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newOrder = arrayMove(items, oldIndex, newIndex);

                // Send reorder request to backend
                router.post('/admin/questions/reorder', {
                    ids: newOrder.map(q => q.id)
                }, {
                    preserveScroll: true,
                    preserveState: true,
                });

                return newOrder;
            });
        }
    };

    const handleQuestionUpdate = (id: string, field: string, value: any) => {
        const question = sortedQuestions.find(q => q.id === id);
        if (!question) return;

        // Prepare a minimal payload with only the field being updated
        let payload: any = {
            [field]: value
        };

        // For tags specifically, ensure they are sent as array of strings
        if (field === 'tags') {
            // Value is already an array of strings from TagAutocomplete
            payload.tags = value;
        }

        router.put(QuestionController.update(id).url, payload, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleQuestionDelete = (id: string) => {
        router.delete(QuestionController.destroy(id).url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const InsertQuestionIndicator = ({ order }: { order: number }) => (
        <div className="group relative h-8 -my-4 z-10 flex items-center justify-center cursor-pointer">
            {/* Hover Area Helper - makes it easier to trigger */}
            <div className="absolute inset-0 z-0" />

            {/* Visual Line */}
            <div className="absolute inset-x-0 h-px bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />

            {/* Button */}
            <Link
                href={`${QuestionController.create().url}?question_bank_id=${questionBank.id}&order=${order}`}
                className="relative z-20 bg-background border rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-primary hover:text-primary-foreground pointer-events-auto transform scale-75 group-hover:scale-100 duration-200"
                title="Sisipkan Pertanyaan Disini"
            >
                <Plus className="h-4 w-4" />
            </Link>
        </div>
    );

    return (
        <AppShell variant="header">
            <Head title={`Edit ${questionBank.name}`} />

            <Tabs defaultValue={defaultTab} className="flex flex-col h-full">

                {/* Custom Top Bar */}
                <div className="sticky top-0 z-30 bg-background border-b shadow-sm">
                    <div className="flex h-16 items-center gap-4 px-6">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={QuestionBankController.index().url}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>

                        <div className="flex-1">
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="h-10 text-lg font-semibold border-transparent focus-visible:ring-0 px-0 hover:border-input focus-visible:border-input focus-visible:px-3 transition-all max-w-md"
                                placeholder="Nama Bank Soal"
                            />
                            {errors.name && <div className="text-sm text-red-500 mt-1">{errors.name}</div>}
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Pengaturan Bank Soal</DialogTitle>
                                    <DialogDescription>
                                        Ubah detail konfigurasi untuk bank soal ini.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="subject">Mata Pelajaran</Label>
                                        <Select
                                            value={data.subject_id.toString()}
                                            onValueChange={(value) => setData('subject_id', parseInt(value))}
                                        >
                                            <SelectTrigger id="subject">
                                                <SelectValue placeholder="Pilih Mata Pelajaran" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subjects.map((subject) => (
                                                    <SelectItem key={subject.id} value={subject.id.toString()}>
                                                        {subject.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.subject_id && <div className="text-sm text-red-500">{errors.subject_id}</div>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Deskripsi</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Deskripsi singkat bank soal..."
                                        />
                                        {errors.description && <div className="text-sm text-red-500">{errors.description}</div>}
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Publik</Label>
                                            <div className="text-sm text-muted-foreground">
                                                Izinkan bank soal ini diakses oleh guru lain.
                                            </div>
                                        </div>
                                        <Switch
                                            checked={data.is_public}
                                            onCheckedChange={(checked) => setData('is_public', checked)}
                                        />
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Button onClick={handleOpenCreateExam}>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Exam
                        </Button>

                        <Button onClick={submit} disabled={processing || !isDirty}>
                            <Save className="mr-2 h-4 w-4" />
                            Simpan
                        </Button>
                    </div>

                    <div className="px-6">
                        <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0 h-auto">
                            <TabsTrigger
                                value="questions"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
                            >
                                Daftar Pertanyaan
                            </TabsTrigger>
                            <TabsTrigger
                                value="reading_materials"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
                            >
                                Bahan Bacaan
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto p-6 bg-muted/10">

                    <div className="container max-w-7xl mx-auto space-y-6 pt-6">

                        {/* QUESTIONS TAB */}
                        <TabsContent value="questions">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-10 space-y-6">
                                    {/* AI Question Generator Card */}
                                    <Card className="border-primary/20">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Sparkles className="h-5 w-5 text-primary" />
                                                <h3 className="text-lg font-semibold">Generator Soal AI</h3>
                                            </div>
                                            <form onSubmit={submitAIGeneration} className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label htmlFor="topic">Topik Soal</Label>
                                                        <Input
                                                            id="topic"
                                                            value={aiForm.data.topic}
                                                            onChange={(e) => aiForm.setData('topic', e.target.value)}
                                                            placeholder="Contoh: Sistem Pernapasan Manusia"
                                                            required
                                                        />
                                                        {aiForm.errors.topic && (
                                                            <div className="text-sm text-red-500">{aiForm.errors.topic}</div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="question_type">Tipe Soal</Label>
                                                        <Select
                                                            value={aiForm.data.question_type}
                                                            onValueChange={(value) => aiForm.setData('question_type', value)}
                                                        >
                                                            <SelectTrigger id="question_type">
                                                                <SelectValue placeholder="Pilih Tipe Soal" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="multiple_choice">Pilihan Ganda (Tunggal)</SelectItem>
                                                                <SelectItem value="true_false">Benar/Salah</SelectItem>
                                                                <SelectItem value="essay">Esai/Uraian</SelectItem>
                                                                <SelectItem value="matching">Menjodohkan</SelectItem>
                                                                <SelectItem value="ordering">Mengurutkan</SelectItem>
                                                                <SelectItem value="multiple_selection">Pilihan Ganda Kompleks</SelectItem>
                                                                <SelectItem value="numerical_input">Input Angka</SelectItem>
                                                                <SelectItem value="arrange_words">Susun Kata</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {aiForm.errors.question_type && (
                                                            <div className="text-sm text-red-500">{aiForm.errors.question_type}</div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="count">Jumlah Soal</Label>
                                                        <Input
                                                            id="count"
                                                            type="number"
                                                            min="1"
                                                            max="5"
                                                            value={aiForm.data.count}
                                                            onChange={(e) => aiForm.setData('count', parseInt(e.target.value))}
                                                            required
                                                        />
                                                        {aiForm.errors.count && (
                                                            <div className="text-sm text-red-500">{aiForm.errors.count}</div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
                                                        <Select
                                                            value={aiForm.data.difficulty}
                                                            onValueChange={(value) => aiForm.setData('difficulty', value)}
                                                        >
                                                            <SelectTrigger id="difficulty">
                                                                <SelectValue placeholder="Pilih Kesulitan" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="mudah">Mudah</SelectItem>
                                                                <SelectItem value="sedang">Sedang</SelectItem>
                                                                <SelectItem value="sulit">Sulit</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {aiForm.errors.difficulty && (
                                                            <div className="text-sm text-red-500">{aiForm.errors.difficulty}</div>
                                                        )}
                                                    </div>
                                                </div>

                                                <Button type="submit" disabled={aiForm.processing || isGenerating} className="w-full sm:w-auto">
                                                    {isGenerating ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Sedang Membuat Soal...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="mr-2 h-4 w-4" />
                                                            {aiForm.processing ? 'Mengirim...' : 'Generate Soal dengan AI'}
                                                        </>
                                                    )}
                                                </Button>

                                                <p className="text-xs text-muted-foreground">
                                                    💡 AI akan membuat soal berdasarikan topik dan parameter yang Anda berikan. Proses ini mungkin memakan waktu beberapa menit.
                                                </p>
                                            </form>
                                        </CardContent>
                                    </Card>

                                    {/* AI Generation Progress Indicator */}
                                    {isGenerating && (
                                        <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                                            <CardContent className="pt-6">
                                                <div className="flex items-center gap-3">
                                                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                                                            AI sedang membuat soal...
                                                        </h4>
                                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                                            Mohon tunggu, soal akan muncul otomatis ketika selesai. Tidak perlu reload halaman.
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* AI Tag Generator Card */}
                                    {questions.length > 0 && (
                                        <Card className="border-purple-500/20">
                                            <CardContent className="pt-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles className="h-5 w-5 text-purple-500" />
                                                        <div>
                                                            <h3 className="text-lg font-semibold">Generator Tag AI</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                Buat tag otomatis untuk semua pertanyaan ({questions.length} soal)
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={handleGenerateTags}
                                                        disabled={isGeneratingTags}
                                                        variant="outline"
                                                        className="border-purple-500 text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950"
                                                    >
                                                        {isGeneratingTags ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Sedang Membuat Tag...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Sparkles className="mr-2 h-4 w-4" />
                                                                Generate Tag dengan AI
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Header for Questions Section */}
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold tracking-tight">Daftar Pertanyaan ({questions.length})</h2>
                                        <div className="flex items-center gap-2">
                                            <UploadQuestionsModal questionBankId={questionBank.id} />
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`${QuestionController.create().url}?question_bank_id=${questionBank.id}`}>
                                                    Tambah Pertanyaan
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>

                                    {questions.length > 0 ? (
                                        <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <SortableContext
                                                items={sortedQuestions.map(q => q.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <div className="space-y-4 pl-8"> {/* Add padding-left for drag handle space */}
                                                    {sortedQuestions.map((question, index) => (
                                                        <div key={question.id} id={`question-index-${index}`} className="scroll-mt-24">
                                                            <SortableQuestionCard
                                                                id={`question-${question.id}`}
                                                                question={question}
                                                                onUpdate={handleQuestionUpdate}
                                                                onDelete={handleQuestionDelete}
                                                                onEdit={(q) => router.visit(QuestionController.edit(q.id).url)}
                                                            />
                                                            <InsertQuestionIndicator order={index + 2} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </SortableContext>
                                        </DndContext>
                                    ) : (
                                        <Card className="min-h-[300px] flex items-center justify-center border-dashed">
                                            <CardContent className="text-center text-muted-foreground">
                                                <p>Belum ada pertanyaan di bank soal ini.</p>
                                                <Button variant="link" className="mt-2" asChild>
                                                    <Link href={`${QuestionController.create().url}?question_bank_id=${questionBank.id}`}>
                                                        Buat Pertanyaan Baru
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                                <div className="hidden lg:block lg:col-span-2 relative">
                                    {/* Placeholder to keep grid column width */}
                                    <div className="absolute inset-0" />
                                    <QuestionNavigation
                                        className="fixed top-44 right-8 w-50 z-40"
                                        totalQuestions={questions.length}
                                        onQuestionClick={scrollToQuestion}
                                        onScrollToTop={scrollToTop}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* READING MATERIALS TAB */}
                        <TabsContent value="reading_materials" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight">Bahan Bacaan</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Kelola wacana atau materi bacaan untuk soal-soal berbasis literasi.
                                    </p>
                                </div>
                                <Button type="button" onClick={() => setIsCreateReaderOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Bahan Bacaan
                                </Button>
                            </div>

                            <div className="grid gap-4">
                                {readingMaterials && readingMaterials.length > 0 ? (
                                    readingMaterials.map((material: any) => (
                                        <Card key={material.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                            <CardContent className="p-0 flex">
                                                <div className="w-2 bg-blue-500 shrink-0" />
                                                <div className="flex-1 p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-semibold text-lg hover:underline cursor-pointer">
                                                                    <Link href={ReadingMaterialController.edit(material.id).url}>
                                                                        {material.title}
                                                                    </Link>
                                                                </h3>
                                                                {material.content ?
                                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border">Teks</span> :
                                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">PDF</span>
                                                                }
                                                            </div>
                                                            <div className="text-sm text-muted-foreground line-clamp-2">
                                                                {material.content ? material.content.substring(0, 150) + '...' : 'Dokumen PDF terlampir.'}
                                                            </div>
                                                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <FileText className="h-3 w-3" />
                                                                    {material.questions_count || material.questions?.length || 0} Soal Terkait
                                                                </span>
                                                                <span>
                                                                    Dibuat: {new Date(material.created_at).toLocaleDateString('id-ID')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button size="sm" variant="outline" asChild>
                                                                <Link href={ReadingMaterialController.edit(material.id).url}>
                                                                    Kelola
                                                                </Link>
                                                            </Button>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button size="icon" variant="ghost">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={ReadingMaterialController.edit(material.id).url}>
                                                                            <Pencil className="mr-2 h-4 w-4" />
                                                                            Edit & Kelola Soal
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        className="text-red-600"
                                                                        onClick={() => {
                                                                            if (confirm('Hapus bahan bacaan ini? Semua soal terkait juga akan terhapus.')) {
                                                                                router.delete(ReadingMaterialController.destroy(material.id).url, {
                                                                                    preserveScroll: true
                                                                                });
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Hapus
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Card className="border-dashed py-12">
                                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-6">
                                            <FileText className="h-12 w-12 mb-4 opacity-20" />
                                            <p className="font-medium">Belum ada bahan bacaan</p>
                                            <p className="text-sm mt-1 mb-4">
                                                Tambahkan bahan bacaan (wacana/artikel) untuk membuat soal berbasis literasi.
                                            </p>
                                            <Button type="button" onClick={() => setIsCreateReaderOpen(true)}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Tambah Bahan Bacaan
                                            </Button>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>

                    </div>
                </div>
            </Tabs>

            {/* CREATE READING MATERIAL DIALOG */}
            <Dialog open={isCreateReaderOpen} onOpenChange={setIsCreateReaderOpen}>
                <DialogContent>
                    <form onSubmit={submitCreateReader}>
                        <DialogHeader>
                            <DialogTitle>Tambah Bahan Bacaan Baru</DialogTitle>
                            <DialogDescription>
                                Masukkan judul untuk bahan bacaan baru. Anda dapat mengedit kontennya setelah ini.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="rm_title">Judul Bacaan</Label>
                                <Input
                                    id="rm_title"
                                    placeholder="Contoh: Manfaat Membaca Buku"
                                    value={readerForm.data.title}
                                    onChange={(e) => readerForm.setData('title', e.target.value)}
                                    required
                                />
                                {readerForm.errors.title && <p className="text-sm text-red-500">{readerForm.errors.title}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={readerForm.processing}>
                                {readerForm.processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Membuat...
                                    </>
                                ) : (
                                    'Buat & Kelola Konten'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Create Exam Modal */}
            <Dialog open={isCreateExamOpen} onOpenChange={setIsCreateExamOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <form onSubmit={submitCreate}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Buat Exam Baru</DialogTitle>
                            <DialogDescription>
                                Buat exam baru dari bank soal "{questionBank.name}"
                            </DialogDescription>
                        </DialogHeader>

                        {loading ? (
                            <div className="py-6 text-center text-muted-foreground">Loading...</div>
                        ) : formData ? (
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Judul Exam</Label>
                                    <Input
                                        value={createForm.data.title}
                                        onChange={(e) => createForm.setData('title', e.target.value)}
                                        placeholder="Nama exam..."
                                    />
                                    <InputError message={createForm.errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Kelas</Label>
                                    <MultiSelect
                                        options={formData.grades.map((grade: any) => ({
                                            label: grade.name,
                                            value: grade.id.toString()
                                        }))}
                                        value={createForm.data.grade_ids}
                                        onChange={(v) => createForm.setData('grade_ids', v)}
                                        placeholder="Pilih Kelas"
                                    />
                                    <InputError message={createForm.errors.grade_ids} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Tahun Ajaran</Label>
                                        <Select
                                            value={createForm.data.academic_year_id}
                                            onValueChange={(v) => createForm.setData('academic_year_id', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Tahun Ajaran" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {formData.academicYears.map((ay: any) => (
                                                    <SelectItem key={ay.id} value={ay.id.toString()}>
                                                        {ay.year} {ay.is_active && '(Aktif)'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={createForm.errors.academic_year_id} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Tipe Exam</Label>
                                        <Select
                                            value={createForm.data.exam_type}
                                            onValueChange={(v) => createForm.setData('exam_type', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Tipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {formData.examTypes.map((et: string) => (
                                                    <SelectItem key={et} value={et}>
                                                        {et}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={createForm.errors.exam_type} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Waktu Mulai</Label>
                                        <Input
                                            type="datetime-local"
                                            value={createForm.data.start_time}
                                            onChange={(e) => createForm.setData('start_time', e.target.value)}
                                        />
                                        <InputError message={createForm.errors.start_time} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Waktu Selesai</Label>
                                        <Input
                                            type="datetime-local"
                                            value={createForm.data.end_time}
                                            onChange={(e) => createForm.setData('end_time', e.target.value)}
                                        />
                                        <InputError message={createForm.errors.end_time} />
                                    </div>
                                </div>

                                {/* Quick Duration Buttons */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Durasi Cepat (dari waktu mulai)</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuickDuration(1)}
                                        >
                                            1 Hari
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuickDuration(3)}
                                        >
                                            3 Hari
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuickDuration(7)}
                                        >
                                            1 Minggu
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuickDuration(14)}
                                        >
                                            2 Minggu
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Durasi (menit)</Label>
                                        <Input
                                            type="number"
                                            value={createForm.data.duration}
                                            onChange={(e) => createForm.setData('duration', parseInt(e.target.value))}
                                        />
                                        <InputError message={createForm.errors.duration} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Passing Score (%)</Label>
                                        <Input
                                            type="number"
                                            value={createForm.data.passing_score}
                                            onChange={(e) => createForm.setData('passing_score', parseInt(e.target.value))}
                                        />
                                        <InputError message={createForm.errors.passing_score} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_randomized"
                                            checked={createForm.data.is_randomized}
                                            onCheckedChange={(c) => createForm.setData('is_randomized', !!c)}
                                        />
                                        <label
                                            htmlFor="is_randomized"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Acak Urutan Soal
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_answer_randomized"
                                            checked={createForm.data.is_answer_randomized}
                                            onCheckedChange={(c) => createForm.setData('is_answer_randomized', !!c)}
                                        />
                                        <label
                                            htmlFor="is_answer_randomized"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Acak Urutan Jawaban
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="show_result_on_finish"
                                            checked={createForm.data.show_result_on_finish}
                                            onCheckedChange={(c) => createForm.setData('show_result_on_finish', !!c)}
                                        />
                                        <label
                                            htmlFor="show_result_on_finish"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Tampilkan Nilai Diahir
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_hint_visible"
                                            checked={createForm.data.is_hint_visible}
                                            onCheckedChange={(c) => createForm.setData('is_hint_visible', !!c)}
                                        />
                                        <label
                                            htmlFor="is_hint_visible"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Tampilkan Hint/Bantuan
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_published"
                                            checked={createForm.data.is_published}
                                            onCheckedChange={(c) => createForm.setData('is_published', !!c)}
                                        />
                                        <label
                                            htmlFor="is_published"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Publish Exam
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Max Attempts (kosongkan untuk unlimited)</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={createForm.data.max_attempts || ''}
                                        onChange={(e) => createForm.setData('max_attempts', e.target.value ? parseInt(e.target.value) : null)}
                                        placeholder="Unlimited"
                                    />
                                    <InputError message={createForm.errors.max_attempts} />
                                </div>

                                <TimerTypeSelector
                                    value={createForm.data.timer_type}
                                    onValueChange={(v) => createForm.setData('timer_type', v)}
                                    timerTypes={formData?.timerTypes}
                                    error={createForm.errors.timer_type}
                                />

                                {/* Read-only fields */}
                                <div className="border-t pt-4 space-y-2">
                                    <div className="text-sm text-muted-foreground">
                                        <strong>Mata Pelajaran:</strong> {questionBank.subject?.name || '-'}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <strong>Guru:</strong> {questionBank.teacher?.name || '-'}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <strong>Bank Soal:</strong> {questionBank.name}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-6 text-center text-muted-foreground">
                                Gagal memuat data form
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateExamOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={createForm.processing || loading}>
                                {createForm.processing ? 'Menyimpan...' : 'Buat Exam'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppShell>
    );
}
