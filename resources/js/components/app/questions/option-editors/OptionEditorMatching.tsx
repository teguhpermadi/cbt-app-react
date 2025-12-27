import React from 'react';
import { Input } from '@/components/ui/input';
import { GitMerge, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Option, OptionEditorProps } from './types';

export default function OptionEditorMatching({ options, onChange }: OptionEditorProps) {

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

    const updatePairContent = (pairId: number, side: 'left' | 'right', val: string) => {
        const idx = options.findIndex(o => o.metadata?.pair_id === pairId && o.metadata?.side === side);
        if (idx >= 0) {
            updateOption(idx, 'content', val);
        }
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

    const leftOpts = options.filter(o => o.metadata?.side === 'left');

    const renderImageUploader = (opt: Option, index: number) => (
        <div className="space-y-2 mt-2">
            <div className="flex items-start gap-2">
                {(!opt.delete_media && (opt.media_url || opt.media_file)) ? (
                    <div className="relative group">
                        <img
                            src={opt.media_file ? URL.createObjectURL(opt.media_file) : opt.media_url!}
                            alt={`Preview`}
                            className="h-20 w-auto min-w-[60px] object-contain rounded-md border bg-muted"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeOptionMedia(index)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <Label htmlFor={`match-file-${index}`} className="h-20 w-20 flex flex-col items-center justify-center rounded-md border border-dashed bg-muted/30 text-muted-foreground cursor-pointer hover:bg-muted/50">
                        <ImageIcon className="h-5 w-5 opacity-50 mb-1" />
                        <span className="text-[10px]">Img</span>
                    </Label>
                )}

                <div className="space-y-1">
                    <Input
                        id={`match-file-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleOptionFileChange(index, e)}
                        className="max-w-[150px] text-xs h-8"
                    />
                </div>
            </div>
        </div>
    );

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
                        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-start">
                            {/* LEFT INPUT */}
                            <div className="space-y-2">
                                <Input
                                    value={leftOpt.content}
                                    onChange={(e) => updatePairContent(pairId, 'left', e.target.value)}
                                    placeholder={`Item ${pairId}`}
                                />
                                {renderImageUploader(leftOpt, leftOptIndex)}
                            </div>

                            <div className="text-muted-foreground flex flex-col items-center justify-center pt-2">
                                <GitMerge className="h-4 w-4" />
                            </div>

                            {/* RIGHT INPUT */}
                            <div className="space-y-2">
                                <Input
                                    value={rightOpt?.content || ''}
                                    onChange={(e) => updatePairContent(pairId, 'right', e.target.value)}
                                    placeholder={`Pasangan ${pairId}`}
                                />
                                {rightOpt && renderImageUploader(rightOpt, rightOptIndex)}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
