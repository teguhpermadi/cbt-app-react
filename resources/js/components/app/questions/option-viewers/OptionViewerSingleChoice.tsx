import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import ImageViewerModal from '@/components/ui/image-viewer-modal';

export interface OptionViewerProps {
    options: Record<string, any>;
    value: any;
    onChange: (value: any) => void;
    disabled?: boolean;
}

export default function OptionViewerSingleChoice({ options, value, onChange, disabled }: OptionViewerProps) {
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [viewingImage, setViewingImage] = useState('');

    return (
        <>
            <RadioGroup
                value={value as string}
                onValueChange={onChange}
                className="space-y-3"
                disabled={disabled}
            >
                {Object.entries(options || {}).map(([key, opt]: [string, any]) => (
                    <div key={key}
                        onClick={() => !disabled && onChange(key)}
                        className={cn(
                            "flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                            value === key ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-800",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}>
                        <RadioGroupItem value={key} id={`opt-${key}`} />
                        <Label htmlFor={`opt-${key}`} className="flex-1 cursor-pointer font-normal">
                            <div className="text-slate-700 dark:text-slate-300">
                                {/* Media Render */}
                                {opt.media_url && (
                                    <div className="mb-3">
                                        <img
                                            src={opt.media_url}
                                            alt="Option Media"
                                            className="max-h-[200px] w-auto rounded-md object-contain border bg-white dark:bg-slate-900 cursor-pointer hover:shadow-lg transition-shadow"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setViewingImage(opt.media_url);
                                                setImageViewerOpen(true);
                                            }}
                                        />
                                    </div>
                                )}
                                <div dangerouslySetInnerHTML={{ __html: opt.content }} />
                            </div>
                        </Label>
                    </div>
                ))}
            </RadioGroup>
            <ImageViewerModal
                src={viewingImage}
                isOpen={imageViewerOpen}
                onClose={() => setImageViewerOpen(false)}
            />
        </>
    );
}
