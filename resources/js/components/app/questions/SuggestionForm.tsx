import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/ui/rich-text/RichTextEditor';
import OptionsEditor from '@/components/app/questions/option-editors/OptionsEditor';
import { Option } from '@/components/app/questions/option-editors/types';
import { Textarea } from '@/components/ui/textarea';

interface SuggestionFormProps {
    initialData: {
        description: string;
        content: string;
        // options: Option[];
    };
    questionType: string;
    onSubmit: (data: { description: string; content: string; options: Option[] }) => void;
    onCancel: () => void;
    isProcessing?: boolean;
}

export default function SuggestionForm({
    initialData,
    questionType,
    onSubmit,
    onCancel,
    isProcessing = false
}: SuggestionFormProps) {
    const [description, setDescription] = useState(initialData.description || '');
    const [content, setContent] = useState(initialData.content);
    const [options, setOptions] = useState<Option[]>(initialData.options || []);
    const [errors, setErrors] = useState<any>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation could go here if needed, 
        // essentially we just pass the data up.
        onSubmit({
            description,
            content,
            options
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label>Alasan / Deskripsi Saran</Label>
                <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan alasan saran perubahan ini..."
                    className="min-h-[80px]"
                />
            </div>

            <div className="space-y-2">
                <Label>Usulan Konten Soal</Label>
                <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Tuliskan usulan perbaikan soal..."
                    className="min-h-[100px]"
                />
            </div>

            {/* <div className="space-y-2">
                <Label>Usulan Opsi Jawaban</Label>
                <div className="border rounded-md p-4 bg-muted/20">
                    <OptionsEditor
                        type={questionType}
                        options={options}
                        onChange={setOptions}
                        errors={errors}
                    />
                </div>
            </div> */}

            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isProcessing}
                >
                    Batal
                </Button>
                <Button
                    type="submit"
                    disabled={isProcessing}
                >
                    Simpan Saran
                </Button>
            </div>
        </form>
    );
}
