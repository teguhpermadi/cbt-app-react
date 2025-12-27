import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Image as ImageIcon, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Option, OptionEditorProps } from './types';

export default function OptionEditorOrdering({ options, onChange }: OptionEditorProps) {

    // Generic update helper
    const updateOptionRaw = (index: number, updates: Partial<Option>) => {
        const newOpts = [...options];
        newOpts[index] = { ...newOpts[index], ...updates };
        onChange(newOpts);
    };

    const updateOption = (index: number, field: keyof Option, value: any) => {
        const newOpts = [...options];
        newOpts[index] = { ...newOpts[index], [field]: value };
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
        onChange([...options, {
            option_key: String(options.length + 1),
            content: '',
            is_correct: true, // Ordering items are implicitly correct in their sequence definition
            order: options.length,
            media_url: null,
            media_file: null
        }]);
    };

    const removeOption = (index: number) => {
        const newOpts = options.filter((_, i) => i !== index);
        onChange(newOpts);
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Urutkan opsi di bawah ini sesuai urutan yang benar.</p>
            {options.map((option, index) => (
                <div key={index} className="flex flex-col gap-2 p-4 border rounded-md">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                            {index + 1}
                        </div>
                        <Input
                            value={option.content}
                            onChange={(e) => updateOption(index, 'content', e.target.value)}
                            placeholder={`Langkah ke-${index + 1}`}
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeOption(index)} className="text-muted-foreground">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Media Upload */}
                    <div className="ml-11 mt-2 space-y-2">
                        <div className="flex items-start gap-4">
                            {(!option.delete_media && (option.media_url || option.media_file)) ? (
                                <div className="relative group">
                                    <img
                                        src={option.media_file ? URL.createObjectURL(option.media_file) : option.media_url!}
                                        alt={`Preview Step ${index + 1}`}
                                        className="h-24 w-auto min-w-[80px] object-contain rounded-md border bg-muted"
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
                                <div className="h-24 w-24 flex items-center justify-center rounded-md border border-dashed bg-muted/50 text-muted-foreground">
                                    <ImageIcon className="h-6 w-6 opacity-50" />
                                </div>
                            )}

                            <div className="space-y-2 pt-2">
                                <Label htmlFor={`order-file-${index}`} className="cursor-pointer text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                                    {option.media_url || option.media_file ? "Ganti Gambar" : "Tambah Gambar"}
                                </Label>
                                <Input
                                    id={`order-file-${index}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleOptionFileChange(index, e)}
                                    className="max-w-xs h-8 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <Button variant="outline" onClick={addOption} className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Tambah Langkah
            </Button>
        </div>
    );
}
