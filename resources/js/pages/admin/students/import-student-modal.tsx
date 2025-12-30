import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import StudentController from '@/actions/App/Http/Controllers/Admin/StudentController';

interface ImportStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ImportStudentModal({ isOpen, onClose }: ImportStudentModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        file: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleImport = () => {
        if (!file) {
            setError("Please select a file to import.");
            return;
        }

        form.setData('file', file);

        form.post(StudentController.storeImport.url(), {
            forceFormData: true,
            onSuccess: () => {
                onClose();
                setFile(null);
                setError(null);
                form.reset();
            },
            onError: (errors) => {
                if (errors.file) {
                    setError(errors.file);
                } else {
                    setError("An error occurred during import. Please try again.");
                }
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <FileSpreadsheet className="size-5 text-green-600" />
                        Import Students from Excel
                    </DialogTitle>
                    <DialogDescription>
                        Upload an Excel file (.xlsx) to import students.
                        Required columns: Name, Username, Email. Password (optional, default: password123).
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div className="flex gap-4 items-end">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="excel-file" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select File</Label>
                            <Input
                                id="excel-file"
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                className="rounded-xl h-11 border-slate-200"
                            />
                            {file && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Selected: <span className="font-medium">{file.name}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="rounded-xl h-11 border-slate-200 shadow-sm gap-2 w-full"
                        onClick={() => window.location.href = StudentController.downloadTemplate.url()}
                    >
                        <Download className="size-4" />
                        Download Template
                    </Button>

                    {error && (
                        <Alert variant="destructive" className="rounded-xl">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="border rounded-xl p-4 bg-slate-50 dark:bg-slate-900">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-muted-foreground space-y-1">
                                <p className="font-bold text-slate-900 dark:text-slate-100">Important:</p>
                                <ul className="list-disc list-inside space-y-0.5">
                                    <li>Ensure your Excel file has the headers: <strong>Name</strong>, <strong>Username</strong>, <strong>Email</strong></li>
                                    <li>Password column is optional (default: password123)</li>
                                    <li>Download the template for the correct format</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} className="rounded-xl h-11">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleImport}
                        className="rounded-xl h-11 bg-primary font-bold shadow-lg shadow-primary/20 gap-2"
                        disabled={!file || form.processing}
                    >
                        {form.processing ? 'Importing...' : 'Import Students'}
                        <CheckCircle className="size-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
