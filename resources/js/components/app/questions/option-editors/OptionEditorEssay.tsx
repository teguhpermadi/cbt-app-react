import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { OptionEditorProps } from './types';
import RichTextEditor from '@/components/ui/rich-text/RichTextEditor';

export default function OptionEditorEssay({ options, onChange, errors }: OptionEditorProps) {

    // For essay questions, we store the expected answer/rubric in the first option
    const essayContent = options[0]?.content || '';

    const handleContentChange = (value: string) => {
        const updatedOptions = [{
            option_key: 'ESSAY',
            content: value,
            is_correct: true,
            order: 0,
            media_url: null,
            media_file: null
        }];
        onChange(updatedOptions);
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Kriteria Jawaban / Rubrik Penilaian</Label>
                        <p className="text-sm text-muted-foreground">
                            Masukkan kriteria jawaban atau rubrik penilaian yang diharapkan untuk soal essay ini.
                            Ini akan membantu dalam proses koreksi manual.
                        </p>
                    </div>

                    <RichTextEditor
                        value={essayContent}
                        onChange={handleContentChange}
                        placeholder="Tulis kriteria jawaban atau rubrik penilaian di sini..."
                        className="min-h-[200px]"
                    />

                    {errors?.['options.0.content'] && (
                        <p className="text-destructive text-xs">{errors['options.0.content']}</p>
                    )}

                    <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground">
                        <p className="font-medium mb-1">💡 Catatan:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Soal essay memerlukan koreksi manual oleh pengajar</li>
                            <li>Gunakan editor di atas untuk menulis kriteria atau rubrik penilaian</li>
                            <li>Anda dapat menggunakan format matematika, teks Arab, atau Jawa sesuai kebutuhan</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
