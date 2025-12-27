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

    // Generic update helper that accepts a partial object to merge
    const updateOptionRaw = (index: number, updates: Partial<Option>) => {
        const newOpts = [...options];
        newOpts[index] = { ...newOpts[index], ...updates };
        onChange(newOpts);
    };

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
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Teks Jawaban</Label>
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
                                    </div>
                                </div>
                                <Textarea
                                    value={option.content}
                                    onChange={(e) => updateOption(index, 'content', e.target.value)}
                                    placeholder={`Jawaban ${option.option_key}`}
                                    className="resize-none min-h-[80px]"
                                />
                                {errors?.[`options.${index}.content`] && (
                                    <p className="text-destructive text-xs">{errors[`options.${index}.content`]}</p>
                                )}
                            </div>

                            {/* Media Upload Section */}
                            <div className="space-y-2">
                                <Label>Gambar Opsi (Opsional)</Label>
                                <div className="flex items-start gap-4">
                                    {(!option.delete_media && (option.media_url || option.media_file)) ? (
                                        <div className="relative group">
                                            <img
                                                src={option.media_file ? URL.createObjectURL(option.media_file) : option.media_url!}
                                                alt={`Preview ${option.option_key}`}
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
                        <Button variant="ghost" size="icon" onClick={() => removeOption(index)} className="text-destructive mt-2">
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
