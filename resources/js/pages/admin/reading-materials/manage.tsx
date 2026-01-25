import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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
        <div className="min-h-screen bg-muted/40 flex flex-col h-screen overflow-hidden">
            <Head title={`Kelola ${readingMaterial.title}`} />

            {/* STICKY HEADER */}
            <div className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b bg-background px-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild className="h-9 w-9">
                        <Link href={`${QuestionBankController.edit(questionBank.id).url}?tab=reading_materials`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="h-6 w-px bg-border hidden md:block" />
                    <Breadcrumb className="hidden md:block">
                        <BreadcrumbList>
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

                <div className="ml-auto flex items-center gap-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteMaterial}
                        className="mr-2"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                    </Button>
                    <Button
                        onClick={handleUpdateMaterial}
                        disabled={processing || !isDirty}
                        size="sm"
                    >
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
                </div>
            </div>

            {/* MAIN CONTENT - 2 COLUMN GRID */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">

                {/* LEFT COLUMN: CONTENT EDITOR */}
                <div className="h-full overflow-y-auto p-6 bg-background space-y-6">
                    {/* Title Section */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-lg font-semibold">Judul Bahan Bacaan</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="text-lg py-6"
                            placeholder="Masukkan judul bahan bacaan..."
                        />
                        <InputError message={errors.title} />
                    </div>

                    <Card className="border-none shadow-none">
                        <CardHeader className="px-0 pt-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Isi Bahan Bacaan</CardTitle>
                                    <CardDescription>
                                        Pilih tipe konten (teks wacana atau file PDF) dan isi materi.
                                    </CardDescription>
                                </div>
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
                        </CardHeader>
                        <CardContent className="px-0">
                            {inputType === 'text' ? (
                                <div className="space-y-2">
                                    <Label htmlFor="content">Isi Bacaan</Label>
                                    <Textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="min-h-[500px] font-serif text-lg leading-relaxed p-6"
                                        placeholder="Tulis wacana di sini..."
                                    />
                                    <InputError message={errors.content} />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {mediaUrl && (
                                        <div className="aspect-[3/4] w-full border rounded-lg overflow-hidden bg-slate-100">
                                            <iframe src={mediaUrl} className="w-full h-full" />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Upload PDF Baru</Label>
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                type="file"
                                                accept="application/pdf"
                                                onChange={(e) => setData('file', e.target.files[0])}
                                                className="max-w-md"
                                            />
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Upload file PDF maksimal 2MB. Jika Anda mengupload file baru, file lama akan terganti.
                                        </div>
                                        <InputError message={errors.file} />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: QUESTIONS LIST */}
                <div className="h-full overflow-y-auto p-6 bg-muted/30 border-l space-y-6">
                    <div className="flex items-center justify-between sticky top-0 bg-muted/30 backdrop-blur-sm py-2 z-10">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-bold">Soal Terkait</h3>
                            <Badge variant="secondary">{questions.length}</Badge>
                        </div>
                        <Button onClick={handleAddQuestion} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Soal
                        </Button>
                    </div>

                    <div className="space-y-4 pb-20">
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
                                        Klik tombol "Buat Soal" untuk menambahkan pertanyaan yang mengacu pada bahan bacaan ini.
                                    </p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
