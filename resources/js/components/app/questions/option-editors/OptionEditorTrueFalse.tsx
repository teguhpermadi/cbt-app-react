import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckSquare, Image as ImageIcon, X } from 'lucide-react';
import { Option, OptionEditorProps } from './types';

export default function OptionEditorTrueFalse({ options, onChange }: OptionEditorProps) {

    // Generic update helper
    const updateOptionRaw = (index: number, updates: Partial<Option>) => {
        const newOpts = [...options];
        newOpts[index] = { ...newOpts[index], ...updates };
        onChange(newOpts);
    };

    const updateOption = (index: number, field: keyof Option, value: any) => {
        const newOpts = [...options];
        newOpts[index] = { ...newOpts[index], [field]: value };

        // Ensure only one correct answer
        if (field === 'is_correct' && value === true) {
            newOpts.forEach((opt, i) => {
                if (i !== index) opt.is_correct = false;
            });
        }
        onChange(newOpts);
    };

    const handleOptionFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            updateOptionRaw(index, {
                media_file: file,
                delete_media: false
            });
        }
    };

    const removeOptionMedia = (index: number) => {
        updateOptionRaw(index, {
            media_file: null,
            media_url: null,
            delete_media: true
        });
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
                <div key={index} className="flex flex-col gap-2">
                    <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all relative ${option.is_correct ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                        onClick={() => updateOption(index, 'is_correct', true)}
                    >
                        <div className="flex items-center justify-between z-10 relative w-full gap-2">
                            <Input
                                value={option.content}
                                onChange={(e) => updateOption(index, 'content', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="font-semibold text-lg bg-transparent border-transparent hover:border-input focus:border-input px-2 shadow-none h-auto transition-colors"
                            />
                            {option.is_correct && <CheckSquare className="h-5 w-5 text-primary shrink-0" />}
                        </div>
                    </div>

                    {/* Media Upload for T/F */}
                    <div className="space-y-2">
                        <Label>Gambar (Opsional)</Label>
                        <div className="flex items-start gap-4">
                            {(!option.delete_media && (option.media_url || option.media_file)) ? (
                                <div className="relative group">
                                    <img
                                        src={option.media_file ? URL.createObjectURL(option.media_file) : option.media_url!}
                                        alt={`Preview ${option.content}`}
                                        className="h-32 w-auto min-w-[100px] object-contain rounded-md border bg-muted"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeOptionMedia(index)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="h-32 w-32 flex items-center justify-center rounded-md border border-dashed bg-muted/50 text-muted-foreground">
                                    <ImageIcon className="h-8 w-8 opacity-50" />
                                </div>
                            )}

                            <div className="space-y-2 pt-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleOptionFileChange(index, e)}
                                    className="max-w-xs"
                                />
                                <p className="text-xs text-muted-foreground">Format: JPG, PNG, GIF. Maks: 2MB.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
