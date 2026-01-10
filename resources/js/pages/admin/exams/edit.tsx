import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useMemo } from 'react';
import InputError from '@/components/input-error';
import { dashboard } from '@/routes/admin';
import { index as examsIndexRoute } from '@/routes/admin/exams';
import { Checkbox } from '@/components/ui/checkbox';
import { TimerTypeSelector } from '@/components/app/timer-type-selector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ArrowLeft, Monitor } from 'lucide-react';
import ExamController from '@/actions/App/Http/Controllers/Admin/ExamController';
import { MultiSelect } from '@/components/ui/multi-select';

// @ts-ignore
const route = window.route;

interface CreateExamForm {
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
    is_answer_randomized: boolean; // Add this
    is_hint_visible: boolean;
    show_result_on_finish: boolean; // Add this
    max_attempts: number | null;   // Add this
    timer_type: string;           // Add this
    passing_score: number;
    start_time: string;
    end_time: string;
}

interface EditProps {
    exam: any;
    academicYears: any[];
    grades: any[];
    subjects: any[];
    teachers: any[];
    examTypes: string[];
    timerTypes: Array<{ value: string, label: string, description: string }>;
    questionBanks: any[];
}

export default function Edit({ exam, academicYears, grades, subjects, teachers, examTypes, timerTypes, questionBanks }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Exam Management', href: examsIndexRoute.url() },
        { title: 'Edit Exam', href: '#' },
    ];

    const form = useForm<CreateExamForm>({
        academic_year_id: exam.academic_year_id || '',
        grade_ids: exam.grades?.map((g: any) => g.id) || [],
        subject_id: exam.subject_id || '',
        teacher_id: exam.teacher_id || '',
        question_bank_id: exam.question_bank_id || '',
        title: exam.title || '',
        exam_type: exam.exam_type || '',
        duration: exam.duration || 0,
        is_published: !!exam.is_published,
        is_randomized: !!exam.is_randomized,
        is_answer_randomized: !!exam.is_answer_randomized,
        is_hint_visible: !!exam.is_hint_visible,
        show_result_on_finish: !!exam.show_result_on_finish,
        max_attempts: exam.max_attempts,
        timer_type: exam.timer_type?.value || exam.timer_type || 'flexible',
        passing_score: exam.passing_score || 0,
        start_time: exam.start_time || '',
        end_time: exam.end_time || '',
    });

    // --- Chained Select Logic ---
    const filteredSubjects = useMemo(() => {
        if (form.data.grade_ids.length === 0) return [];
        return subjects.filter((s: any) => form.data.grade_ids.includes(s.grade_id));
    }, [form.data.grade_ids, subjects]);

    const filteredQuestionBanks = useMemo(() => {
        if (!form.data.subject_id) return [];
        return questionBanks.filter((qb: any) => qb.subject_id === form.data.subject_id);
    }, [form.data.subject_id, questionBanks]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(ExamController.update({ exam: exam.id }).url, {
            preserveScroll: true,
            onSuccess: () => {
                // Optional: show toast
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Exam - ${exam.title}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.visit(examsIndexRoute.url())}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Edit Exam: {exam.title}
                            </h1>
                            <p className="text-muted-foreground font-medium">
                                Manage exam settings.
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
                        onClick={() => router.visit(ExamController.monitor(exam.id).url)}
                    >
                        <Monitor className="h-4 w-4" />
                        Monitor Exam
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Exam Settings</CardTitle>
                        <CardDescription>
                            Update the configuration for this exam.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                                    <InputError message={form.errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Exam Type</Label>
                                    <Select onValueChange={(v) => form.setData('exam_type', v)} value={form.data.exam_type}>
                                        <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                        <SelectContent>{examTypes.map(et => <SelectItem key={et} value={et}>{et}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <InputError message={form.errors.exam_type} />
                                </div>
                            </div>

                            {/* Academic Year, Grade, Subject, Teacher, QB Selectors - Assuming these might not be editable easily as they define the exam context, but let's allow it or keep it read-only if desired. User didn't specify, so I'll include them as editable for now but maybe disabled if risky. Actually, typically these are editable. */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Academic Year</Label>
                                    <Select onValueChange={(v) => form.setData('academic_year_id', v)} value={form.data.academic_year_id}>
                                        <SelectTrigger><SelectValue placeholder="Select Academic Year" /></SelectTrigger>
                                        <SelectContent>
                                            {academicYears.map((ay: any) => (
                                                <SelectItem key={ay.id} value={ay.id}>{ay.year}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.academic_year_id} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Teacher</Label>
                                    <Select onValueChange={(v) => form.setData('teacher_id', v)} value={form.data.teacher_id}>
                                        <SelectTrigger><SelectValue placeholder="Select Teacher" /></SelectTrigger>
                                        <SelectContent>
                                            {teachers.map((t: any) => (
                                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.teacher_id} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Grade</Label>
                                    <MultiSelect
                                        options={grades.map((g: any) => ({ label: g.name, value: g.id }))}
                                        value={form.data.grade_ids}
                                        onChange={(v) => form.setData('grade_ids', v)}
                                        placeholder="Select Grades"
                                    />
                                    <InputError message={form.errors.grade_ids} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <Select onValueChange={(v) => form.setData('subject_id', v)} value={form.data.subject_id}>
                                        <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                        <SelectContent>
                                            {filteredSubjects.map((s: any) => (
                                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.subject_id} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Question Bank</Label>
                                <Select onValueChange={(v) => form.setData('question_bank_id', v)} value={form.data.question_bank_id}>
                                    <SelectTrigger><SelectValue placeholder="Select Question Bank" /></SelectTrigger>
                                    <SelectContent>
                                        {filteredQuestionBanks.map((qb: any) => (
                                            <SelectItem key={qb.id} value={qb.id}>{qb.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.question_bank_id} />
                            </div>


                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Start Time</Label>
                                    <Input type="datetime-local" value={form.data.start_time ? new Date(form.data.start_time).toISOString().slice(0, 16) : ''} onChange={(e) => form.setData('start_time', e.target.value)} />
                                    <InputError message={form.errors.start_time} />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Time</Label>
                                    <Input type="datetime-local" value={form.data.end_time ? new Date(form.data.end_time).toISOString().slice(0, 16) : ''} onChange={(e) => form.setData('end_time', e.target.value)} />
                                    <InputError message={form.errors.end_time} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Duration (minutes)</Label>
                                    <Input type="number" value={form.data.duration} onChange={(e) => form.setData('duration', parseInt(e.target.value))} />
                                    <InputError message={form.errors.duration} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Passing Score</Label>
                                    <Input type="number" value={form.data.passing_score} onChange={(e) => form.setData('passing_score', parseInt(e.target.value))} />
                                    <InputError message={form.errors.passing_score} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Max Attempts (Empty for unlimited)</Label>
                                    <Input type="number" min="1" value={form.data.max_attempts || ''} onChange={(e) => form.setData('max_attempts', e.target.value ? parseInt(e.target.value) : null)} />
                                    <InputError message={form.errors.max_attempts} />
                                </div>

                                <TimerTypeSelector
                                    value={form.data.timer_type}
                                    onValueChange={(v) => form.setData('timer_type', v)}
                                    timerTypes={timerTypes}
                                    error={form.errors.timer_type}
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="edit_is_randomized" checked={form.data.is_randomized} onCheckedChange={(c) => form.setData('is_randomized', !!c)} />
                                    <label htmlFor="edit_is_randomized" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Randomize Questions</label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="edit_is_answer_randomized" checked={form.data.is_answer_randomized} onCheckedChange={(c) => form.setData('is_answer_randomized', !!c)} />
                                    <label htmlFor="edit_is_answer_randomized" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Randomize Answer Options</label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="edit_show_result_on_finish" checked={form.data.show_result_on_finish} onCheckedChange={(c) => form.setData('show_result_on_finish', !!c)} />
                                    <label htmlFor="edit_show_result_on_finish" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Show Result on Finish</label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <label htmlFor="edit_is_published" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Publish Exam</label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="edit_is_hint_visible" checked={form.data.is_hint_visible} onCheckedChange={(c) => form.setData('is_hint_visible', !!c)} />
                                    <label htmlFor="edit_is_hint_visible" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Show Hints to Students</label>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={form.processing}>Save Changes</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
