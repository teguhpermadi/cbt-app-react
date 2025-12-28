import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { OptionViewerProps } from './OptionViewerSingleChoice';
import ImageViewerModal from '@/components/ui/image-viewer-modal';

export default function OptionViewerMultipleChoice({ options, value, onChange, disabled }: OptionViewerProps) {
    const selectedKeys = Array.isArray(value) ? value : [];
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [viewingImage, setViewingImage] = useState('');

    const toggleSelection = (key: string) => {
        if (disabled) return;

        let newSelection;
        if (selectedKeys.includes(key)) {
            newSelection = selectedKeys.filter((k: string) => k !== key);
        } else {
            newSelection = [...selectedKeys, key];
        }
        onChange(newSelection);
    };

    return (
        <>
            <div className="space-y-3">
                {Object.entries(options || {}).map(([key, opt]: [string, any]) => (
                    <div key={key}
                        onClick={() => toggleSelection(key)}
                        className={cn(
                            "flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                            selectedKeys.includes(key) ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-800",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}>
                        <Checkbox
                            checked={selectedKeys.includes(key)}
                            id={`opt-${key}`}
                            disabled={disabled}
                        />
                        <Label htmlFor={`opt-${key}`} className="flex-1 cursor-pointer font-normal ml-1">
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
            </div>
            <ImageViewerModal
                src={viewingImage}
                isOpen={imageViewerOpen}
                onClose={() => setImageViewerOpen(false)}
            />
        </>
    );
}
