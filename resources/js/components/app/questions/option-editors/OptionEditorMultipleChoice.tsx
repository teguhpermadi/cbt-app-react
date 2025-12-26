import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, Image as ImageIcon, X } from 'lucide-react'; // Changed XIcon to X
import { Option, OptionEditorProps } from './types';

interface Props extends OptionEditorProps {
    type: 'multiple_choice' | 'multiple_selection';
}

export default function OptionEditorMultipleChoice({ options, onChange, type, errors }: Props) {

    const updateOption = (index: number, field: keyof Option, value: any) => {
        const newOpts = [...options];
        newOpts[index] = { ...newOpts[index], [field]: value };

        // Handle Logic for Single Choice (Radio behavior)
        if (type === 'multiple_choice') {
            if (field === 'is_correct' && value === true) {
                // Uncheck others
                newOpts.forEach((opt, i) => {
                    if (i !== index) opt.is_correct = false;
                });
            }
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
        updateOption(index, 'media_url', null); // Clear existing URL preview
        updateOption(index, 'delete_media', true);
    };

    const addOption = () => {
        const nextKey = String.fromCharCode(65 + options.length); // A, B, C...
        onChange([...options, {
            option_key: nextKey,
            content: '',
            is_correct: false,
            order: options.length,
            media_url: null,
            media_file: null
        }]);
    };

    const removeOption = (index: number) => {
        const newOpts = options.filter((_, i) => i !== index);
        // Re-key A, B, C...
        newOpts.forEach((o, i) => o.option_key = String.fromCharCode(65 + i));
        onChange(newOpts);
    };

    return (
        <div className="space-y-4">
            {options.map((option, index) => (
                <Card key={index}>
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className="pt-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold">
                                {option.option_key}
                            </span>
                        </div>
                        <div className="flex-1 space-y-3">
                            <Textarea
                                value={option.content}
                                onChange={(e) => updateOption(index, 'content', e.target.value)}
                                placeholder={`Jawaban ${option.option_key}`}
                                className="resize-none min-h-[80px]"
                            />
                            {errors?.[`options.${index}.content`] && (
                                <p className="text-destructive text-xs">{errors[`options.${index}.content`]}</p>
                            )}

                            <div className="flex items-center gap-4">
                                {/* Control Correctness */}
                                <div className="flex items-center gap-2">
                                    {type === 'multiple_choice' ? (
                                        <div className="flex items-center gap-2 cursor-pointer p-1" onClick={() => updateOption(index, 'is_correct', true)}>
                                            <div className={`h-4 w-4 rounded-full border border-primary flex items-center justify-center ${option.is_correct ? 'bg-primary' : ''}`}>
                                                {option.is_correct && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                                            </div>
                                            <Label className="cursor-pointer">Benar</Label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`opt-${index}`}
                                                checked={option.is_correct}
                                                onCheckedChange={(c) => updateOption(index, 'is_correct', !!c)}
                                            />
                                            <Label htmlFor={`opt-${index}`}>Benar</Label>
                                        </div>
                                    )}
                                </div>

                                <div className="h-4 w-px bg-border" />

                                {/* Media Control */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor={`file-${index}`} className="cursor-pointer flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2 py-1 rounded-md">
                                            <ImageIcon className="h-3.5 w-3.5" />
                                            {option.media_url || option.media_file ? "Ganti Gambar" : "Tambah Gambar"}
                                        </Label>
                                        <Input
                                            id={`file-${index}`}
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

                                    {/* File Name Indicator (if new file selected) */}
                                    {option.media_file && (
                                        <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                                            {option.media_file.name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Media Preview */}
                            {(option.media_url || option.media_file) && !option.delete_media && (
                                <div className="mt-3 p-2 border rounded-md bg-muted/30">
                                    <p className="text-[10px] text-muted-foreground mb-1">Preview Gambar:</p>
                                    <img
                                        src={option.media_file ? URL.createObjectURL(option.media_file) : option.media_url!}
                                        alt={`Preview Opsi ${option.option_key}`}
                                        className="h-32 w-auto min-w-[100px] object-contain rounded-sm border bg-background"
                                    />
                                </div>
                            )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeOption(index)} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            ))}
            <Button variant="outline" onClick={addOption} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Tambah Opsi
            </Button>
        </div>
    );
}
