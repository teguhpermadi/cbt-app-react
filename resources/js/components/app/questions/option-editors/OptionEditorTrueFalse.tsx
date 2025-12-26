import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckSquare, Image as ImageIcon } from 'lucide-react';
import { Option, OptionEditorProps } from './types';

export default function OptionEditorTrueFalse({ options, onChange }: OptionEditorProps) {

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
            updateOption(index, 'media_file', file);
            updateOption(index, 'delete_media', false);
        }
    };

    const removeOptionMedia = (index: number) => {
        updateOption(index, 'media_file', null);
        updateOption(index, 'media_url', null);
        updateOption(index, 'delete_media', true);
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
                <div key={index} className="flex flex-col gap-2">
                    <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all relative ${option.is_correct ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                        onClick={() => updateOption(index, 'is_correct', true)}
                    >
                        <div className="flex items-center justify-between z-10 relative">
                            <span className="font-semibold text-lg">{option.content}</span>
                            {option.is_correct && <CheckSquare className="h-5 w-5 text-primary" />}
                        </div>
                    </div>

                    {/* Media Upload for T/F */}
                    <div className="flex items-center gap-2">
                        <Label htmlFor={`tf-file-${index}`} className="cursor-pointer flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2 py-1 rounded-md">
                            <ImageIcon className="h-3.5 w-3.5" />
                            {option.media_url || option.media_file ? "Ganti Gambar" : "Tambah Gambar"}
                        </Label>
                        <Input
                            id={`tf-file-${index}`}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleOptionFileChange(index, e)}
                        />
                        {(option.media_url || option.media_file) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                className="h-7 px-2 text-destructive hover:bg-destructive/10 text-xs"
                                onClick={() => removeOptionMedia(index)}
                            >
                                Hapus
                            </Button>
                        )}
                    </div>
                    {/* Media Preview */}
                    {(option.media_url || option.media_file) && !option.delete_media && (
                        <div className="mt-1 p-2 border rounded-md bg-muted/30">
                            <img
                                src={option.media_file ? URL.createObjectURL(option.media_file) : option.media_url!}
                                alt={`Preview ${option.content}`}
                                className="h-24 w-auto object-contain rounded-sm border bg-background mx-auto"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
