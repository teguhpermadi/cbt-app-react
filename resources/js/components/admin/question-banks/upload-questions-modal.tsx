import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { router, useForm } from '@inertiajs/react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import QuestionBankController from '@/actions/App/Http/Controllers/Admin/QuestionBankController';

interface UploadQuestionsModalProps {
    questionBankId: number;
}

export function UploadQuestionsModal({ questionBankId }: UploadQuestionsModalProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.file) {
            return;
        }

        post(`/admin/question-banks/${questionBankId}/upload-questions`, {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('file', e.target.files[0]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Soal dari Word
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Upload Soal dari Dokumen Word</DialogTitle>
                    <DialogDescription>
                        Upload file .docx yang berisi soal-soal dengan format tabel.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="file">File Word (.docx)</Label>
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="file"
                                className="flex-1 flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                <FileText className="h-4 w-4" />
                                <span className="text-sm text-muted-foreground">
                                    {data.file ? data.file.name : 'Pilih file...'}
                                </span>
                                <input
                                    id="file"
                                    type="file"
                                    accept=".docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {errors.file && (
                            <p className="text-sm text-red-500">{errors.file}</p>
                        )}
                    </div>

                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                            <div className="space-y-2">
                                <p>
                                    File harus berupa tabel dengan 5 kolom: <strong>Tipe Soal, Pertanyaan, Opsi, Kunci, Poin</strong>.
                                    Maksimal ukuran file 10MB.
                                </p>
                                <a
                                    href="/admin/question-banks/template/download"
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                    download
                                >
                                    <FileText className="h-4 w-4" />
                                    Download Template Word
                                </a>
                            </div>
                        </AlertDescription>
                    </Alert>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing || !data.file}>
                            {processing ? 'Mengupload...' : 'Upload'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
