import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { OptionViewerProps } from './OptionViewerSingleChoice';
import ImageViewerModal from '@/components/ui/image-viewer-modal';
import MathRenderer from '../MathRenderer';

export default function OptionViewerMultipleChoice({ options, value, onChange, disabled, showMedia = true }: OptionViewerProps) {
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
                            selectedKeys.map(String).includes(String(key)) ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
                            disabled && "cursor-default"
                        )}>
                        <Checkbox
                            checked={selectedKeys.map(String).includes(String(key))}
                            id={`opt-${key}`}
                            disabled={disabled}
                            className={disabled ? "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" : ""}
                        />
                        <Label htmlFor={`opt-${key}`} className="flex-1 cursor-pointer font-normal ml-1">
                            <div className="text-slate-700 dark:text-slate-300">
                                {/* Media Render */}
                                {showMedia && opt.media_url && (
                                    <div className="mb-3">
                                        <img
                                            src={opt.media_url}
                                            alt="Option Media"
                                            className="max-h-[100px] w-auto rounded-md object-contain border bg-white dark:bg-slate-900 cursor-pointer hover:shadow-lg transition-shadow"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setViewingImage(opt.media_url);
                                                setImageViewerOpen(true);
                                            }}
                                        />
                                    </div>
                                )}
                                <MathRenderer content={opt.content} />
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
