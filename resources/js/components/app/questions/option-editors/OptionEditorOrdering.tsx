import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Option, OptionEditorProps } from './types';

export default function OptionEditorOrdering({ options, onChange }: OptionEditorProps) {

    const updateOption = (index: number, field: keyof Option, value: any) => {
        const newOpts = [...options];
        newOpts[index] = { ...newOpts[index], [field]: value };
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
                    <div className="flex items-center gap-2 ml-11">
                        <Label htmlFor={`order-file-${index}`} className="cursor-pointer flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2 py-1 rounded-md">
                            <ImageIcon className="h-3.5 w-3.5" />
                            {option.media_url || option.media_file ? "Ganti Gambar" : "Tambah Gambar"}
                        </Label>
                        <Input
                            id={`order-file-${index}`}
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
                        {option.media_file && <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">{option.media_file.name}</span>}
                    </div>

                    {(option.media_url || option.media_file) && !option.delete_media && (
                        <div className="ml-11 mt-1 p-2 border rounded-md bg-muted/30 w-fit">
                            <img
                                src={option.media_file ? URL.createObjectURL(option.media_file) : option.media_url!}
                                alt={`Preview Step ${index + 1}`}
                                className="h-24 w-auto object-contain rounded-sm border bg-background"
                            />
                        </div>
                    )}
                </div>
            ))}
            <Button variant="outline" onClick={addOption} className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Tambah Langkah
            </Button>
        </div>
    );
}
