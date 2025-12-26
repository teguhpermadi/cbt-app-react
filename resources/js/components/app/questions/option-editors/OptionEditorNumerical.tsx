import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon } from 'lucide-react';
import { Option, OptionEditorProps } from './types';

export default function OptionEditorNumerical({ options, onChange }: OptionEditorProps) {

    // Find existing or create one default option
    const numOption = options[0] || { option_key: 'NUM', content: '', is_correct: true, order: 0, metadata: {}, media_url: null, media_file: null };
    const meta = numOption.metadata || {};

    const updateOptionFull = (newOpt: Option) => {
        const newOpts = [...options];
        if (newOpts.length === 0) newOpts.push(newOpt);
        else newOpts[0] = newOpt;
        onChange(newOpts);
    };

    const updateNum = (field: string, val: any, isMeta = false) => {
        let newOpt = { ...numOption };
        if (isMeta) {
            newOpt.metadata = { ...meta, [field]: val };
        } else {
            // @ts-ignore
            newOpt[field] = val;
        }
        updateOptionFull(newOpt);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            let newOpt = { ...numOption, media_file: file, delete_media: false };
            updateOptionFull(newOpt);
        }
    };

    const removeMedia = () => {
        let newOpt = { ...numOption, media_file: null, media_url: null, delete_media: true };
        updateOptionFull(newOpt);
    };

    return (
        <Card>
            <CardHeader><CardTitle className="text-base">Jawaban Angka</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Jawaban Benar (Angka)</Label>
                        <Input
                            type="number"
                            step="any"
                            value={numOption.content}
                            onChange={(e) => updateNum('content', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Toleransi (+/-)</Label>
                        <Input
                            type="number"
                            step="any"
                            value={meta.tolerance || 0}
                            onChange={(e) => updateNum('tolerance', parseFloat(e.target.value), true)}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Satuan (Opsional)</Label>
                    <Input
                        value={meta.unit || ''}
                        onChange={(e) => updateNum('unit', e.target.value, true)}
                        placeholder="Contoh: cm, kg, m²"
                    />
                </div>

                {/* Media Upload */}
                <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="num-file" className="cursor-pointer flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2 py-1 rounded-md">
                            <ImageIcon className="h-3.5 w-3.5" />
                            {numOption.media_url || numOption.media_file ? "Ganti Gambar Penjelasan" : "Tambah Gambar Penjelasan"}
                        </Label>
                        <Input
                            id="num-file"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {(numOption.media_url || numOption.media_file) && (
                            <Button // Fixed: Changed 'button' to Button component
                                variant="ghost" // Fixed: Added variant
                                size="sm" // Fixed: Added size
                                type="button"
                                className="h-7 px-2 text-destructive hover:bg-destructive/10 text-xs" // Fixed: Added className
                                onClick={removeMedia}
                            >
                                Hapus
                            </Button>
                        )}
                        {numOption.media_file && <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">{numOption.media_file.name}</span>}
                    </div>

                    {(numOption.media_url || numOption.media_file) && !numOption.delete_media && (
                        <div className="mt-1 p-2 border rounded-md bg-muted/30 w-fit">
                            <img
                                src={numOption.media_file ? URL.createObjectURL(numOption.media_file) : numOption.media_url!}
                                alt="Preview"
                                className="h-32 w-auto object-contain rounded-sm border bg-background"
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
