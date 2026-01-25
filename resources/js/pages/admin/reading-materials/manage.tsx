import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { AppSidebar } from '@/components/app-sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { ArrowLeft, Upload, FileText, Plus, Save, Loader2, BookOpen, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';

// Reusing Question Components
import QuestionCard from '@/components/app/questions/QuestionCard';

// Wayfinder Imports
import ReadingMaterialController from '@/actions/App/Http/Controllers/Admin/ReadingMaterialController';
import QuestionBankController from '@/actions/App/Http/Controllers/Admin/QuestionBankController';
import QuestionController from '@/actions/App/Http/Controllers/Admin/QuestionController';

export default function Manage({ readingMaterial, questionBank, questions, mediaUrl }) {
    // FORM STATE FOR READING MATERIAL CONTENT
    const { data, setData, post, processing, errors, isDirty } = useForm({
        _method: 'PUT',
        title: readingMaterial.title,
        content: readingMaterial.content || '',
        file: null,
    });

    const [inputType, setInputType] = useState(mediaUrl ? 'file' : (readingMaterial.content ? 'text' : 'text'));

    const handleUpdateMaterial = (e) => {
        e.preventDefault();
        post(ReadingMaterialController.update(readingMaterial.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                // Optional toast
            }
        });
    };

    const handleDeleteMaterial = () => {
        if (confirm('Apakah Anda yakin ingin menghapus bahan bacaan ini beserta semua soal di dalamnya?')) {
            router.delete(ReadingMaterialController.destroy(readingMaterial.id).url);
        }
    };

    // QUESTION MANAGEMENT
    const handleAddQuestion = () => {
        // Redirect to create question with prepopulated params
        router.visit(`${QuestionController.create().url}?question_bank_id=${questionBank.id}&reading_material_id=${readingMaterial.id}`);
    };

    const handleEditQuestion = (question) => {
        router.visit(QuestionController.edit(question.id).url);
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-white dark:bg-slate-950">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={QuestionBankController.index().url}>Bank Soal</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`${QuestionBankController.edit(questionBank.id).url}?tab=reading_materials`}>
                                        {questionBank.name}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Kelola Bahan Bacaan</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
                    {/* Toolbar Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" asChild>
                                <Link href={`${QuestionBankController.edit(questionBank.id).url}?tab=reading_materials`}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">{readingMaterial.title}</h1>
                                <p className="text-xs text-muted-foreground">Bank Soal: {questionBank.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="destructive" size="sm" onClick={handleDeleteMaterial}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus Bahan
                            </Button>
                        </div>
                    </div>

                    {/* Split View Content */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">

                        {/* LEFT PANEL: MATERIAL EDITOR */}
                        <div className="h-full overflow-y-auto border-r p-6 bg-white dark:bg-slate-950">
                            <div className="max-w-2xl mx-auto space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                        Konten Bacaan
                                    </h2>
                                    {isDirty && (
                                        <Badge variant="secondary" className="animate-pulse text-yellow-600">
                                            Belum Disimpan
                                        </Badge>
                                    )}
                                </div>

                                <Card>
                                    <form onSubmit={handleUpdateMaterial}>
                                        <CardContent className="space-y-4 pt-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="title">Judul</Label>
                                                <Input
                                                    id="title"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                />
                                                <InputError message={errors.title} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Tipe Konten</Label>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant={inputType === 'text' ? 'default' : 'outline'}
                                                        onClick={() => setInputType('text')}
                                                    >
                                                        Teks
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant={inputType === 'file' ? 'default' : 'outline'}
                                                        onClick={() => setInputType('file')}
                                                    >
                                                        File PDF
                                                    </Button>
                                                </div>
                                            </div>

                                            {inputType === 'text' ? (
                                                <div className="space-y-2">
                                                    <Label htmlFor="content">Isi Bacaan</Label>
                                                    <Textarea
                                                        id="content"
                                                        value={data.content}
                                                        onChange={(e) => setData('content', e.target.value)}
                                                        className="min-h-[400px] font-serif text-lg leading-relaxed"
                                                        placeholder="Tulis wacana di sini..."
                                                    />
                                                    <InputError message={errors.content} />
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {mediaUrl && (
                                                        <div className="aspect-[3/4] w-full border rounded-lg overflow-hidden bg-slate-100">
                                                            <iframe src={mediaUrl} className="w-full h-full" />
                                                        </div>
                                                    )}

                                                    <div className="space-y-2">
                                                        <Label>Upload PDF Baru</Label>
                                                        <Input
                                                            type="file"
                                                            accept="application/pdf"
                                                            onChange={(e) => setData('file', e.target.files[0])}
                                                        />
                                                        <InputError message={errors.file} />
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="justify-end border-t bg-slate-50/50 dark:bg-slate-900/50 py-3">
                                            <Button type="submit" disabled={processing} size="sm">
                                                {processing ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Menyimpan...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="mr-2 h-4 w-4" />
                                                        Simpan Perubahan
                                                    </>
                                                )}
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </div>
                        </div>

                        {/* RIGHT PANEL: QUESTIONS MANAGER */}
                        <div className="h-full overflow-y-auto p-6 bg-slate-50/30 dark:bg-slate-900/10">
                            <div className="max-w-2xl mx-auto space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-green-600" />
                                        Daftar Pertanyaan
                                        <Badge variant="outline">{questions.length}</Badge>
                                    </h2>
                                    <Button onClick={handleAddQuestion} size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Soal Baru
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {questions.length > 0 ? (
                                        questions.map((question) => (
                                            <QuestionCard
                                                key={question.id}
                                                question={question}
                                                readOnly={false}
                                                onEdit={() => handleEditQuestion(question)}
                                                onDelete={() => {
                                                    if (confirm('Hapus pertanyaan ini?')) {
                                                        router.delete(QuestionController.destroy(question.id).url, { preserveScroll: true });
                                                    }
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <Card className="border-dashed py-12">
                                            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-6">
                                                <BookOpen className="h-12 w-12 mb-4 opacity-20" />
                                                <p className="font-medium">Belum ada pertanyaan</p>
                                                <p className="text-sm mt-1">
                                                    Klik tombol di atas untuk membuat pertanyaan berdasarkan materi di samping.
                                                </p>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
