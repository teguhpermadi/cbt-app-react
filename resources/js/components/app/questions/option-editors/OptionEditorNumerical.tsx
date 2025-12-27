import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, X } from 'lucide-react';
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
                    <div className="flex items-start gap-4">
                        {(!numOption.delete_media && (numOption.media_url || numOption.media_file)) ? (
                            <div className="relative group">
                                <img
                                    src={numOption.media_file ? URL.createObjectURL(numOption.media_file) : numOption.media_url!}
                                    alt="Preview"
                                    className="h-32 w-auto min-w-[100px] object-contain rounded-md border bg-muted"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={removeMedia}
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
                            <Label htmlFor="num-file" className="cursor-pointer text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                                {numOption.media_url || numOption.media_file ? "Ganti Gambar Penjelasan" : "Tambah Gambar Penjelasan"}
                            </Label>
                            <Input
                                id="num-file"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="max-w-xs h-8 text-xs"
                            />
                            <p className="text-[10px] text-muted-foreground">Format: JPG, PNG, GIF. Maks: 2MB.</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
