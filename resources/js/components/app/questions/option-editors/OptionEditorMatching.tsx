import React from 'react';
import { Input } from '@/components/ui/input';
import { GitMerge, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Option, OptionEditorProps } from './types';

export default function OptionEditorMatching({ options, onChange }: OptionEditorProps) {

    const updateOption = (index: number, field: keyof Option, value: any) => {
        const newOpts = [...options];
        newOpts[index] = { ...newOpts[index], [field]: value };
        onChange(newOpts);
    };

    const updatePairContent = (pairId: number, side: 'left' | 'right', val: string) => {
        const idx = options.findIndex(o => o.metadata?.pair_id === pairId && o.metadata?.side === side);
        if (idx >= 0) {
            updateOption(idx, 'content', val);
        }
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

    const leftOpts = options.filter(o => o.metadata?.side === 'left');

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 font-semibold text-muted-foreground mb-2 px-4">
                <div>Kolom Kiri</div>
                <div></div>
                <div>Kolom Kanan (Jawaban)</div>
            </div>
            {leftOpts.map((leftOpt, i) => {
                const pairId = leftOpt.metadata?.pair_id;
                const rightOptIndex = options.findIndex(o => o.metadata?.pair_id === pairId && o.metadata?.side === 'right');
                const rightOpt = options[rightOptIndex];

                // Find actual index of leftOpt in main options array for updates
                const leftOptIndex = options.findIndex(o => o === leftOpt);

                return (
                    <div key={pairId ?? `pair-${i}`} className="space-y-2 border-b pb-4 last:border-0">
                        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                            {/* LEFT INPUT */}
                            <div className="space-y-2">
                                <Input
                                    value={leftOpt.content}
                                    onChange={(e) => updatePairContent(pairId, 'left', e.target.value)}
                                    placeholder={`Item ${pairId}`}
                                />
                                {/* Media Left */}
                                <div className="flex items-center gap-2">
                                    <Label htmlFor={`match-l-file-${leftOptIndex}`} className="cursor-pointer flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                                        <ImageIcon className="h-3 w-3" /> Img
                                    </Label>
                                    <Input id={`match-l-file-${leftOptIndex}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleOptionFileChange(leftOptIndex, e)} />
                                    {(leftOpt.media_url || leftOpt.media_file) && (
                                        <Button variant="ghost" size="sm" className="h-6 px-1 text-destructive text-[10px]" onClick={() => removeOptionMedia(leftOptIndex)}>Hapus</Button>
                                    )}
                                    {leftOpt.media_file && <span className="text-[10px] truncate max-w-[80px]">{leftOpt.media_file.name}</span>}
                                </div>
                                {(leftOpt.media_url || leftOpt.media_file) && !leftOpt.delete_media && (
                                    <img src={leftOpt.media_file ? URL.createObjectURL(leftOpt.media_file) : leftOpt.media_url!} className="h-16 w-auto object-contain border rounded bg-muted" />
                                )}
                            </div>

                            <div className="text-muted-foreground flex flex-col items-center justify-center h-full">
                                <GitMerge className="h-4 w-4" />
                            </div>

                            {/* RIGHT INPUT */}
                            <div className="space-y-2">
                                <Input
                                    value={rightOpt?.content || ''}
                                    onChange={(e) => updatePairContent(pairId, 'right', e.target.value)}
                                    placeholder={`Pasangan ${pairId}`}
                                />
                                {/* Media Right */}
                                <div className="flex items-center gap-2">
                                    <Label htmlFor={`match-r-file-${rightOptIndex}`} className="cursor-pointer flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                                        <ImageIcon className="h-3 w-3" /> Img
                                    </Label>
                                    <Input id={`match-r-file-${rightOptIndex}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleOptionFileChange(rightOptIndex, e)} />
                                    {(rightOpt.media_url || rightOpt.media_file) && (
                                        <Button variant="ghost" size="sm" className="h-6 px-1 text-destructive text-[10px]" onClick={() => removeOptionMedia(rightOptIndex)}>Hapus</Button>
                                    )}
                                    {rightOpt.media_file && <span className="text-[10px] truncate max-w-[80px]">{rightOpt.media_file.name}</span>}
                                </div>
                                {(rightOpt.media_url || rightOpt.media_file) && !rightOpt.delete_media && (
                                    <img src={rightOpt.media_file ? URL.createObjectURL(rightOpt.media_file) : rightOpt.media_url!} className="h-16 w-auto object-contain border rounded bg-muted" />
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
