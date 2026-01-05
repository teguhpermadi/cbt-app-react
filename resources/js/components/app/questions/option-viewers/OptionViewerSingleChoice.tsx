import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import MathRenderer from '../MathRenderer';

export interface OptionViewerProps {
    options: Record<string, any>;
    value: any;
    onChange: (value: any) => void;
    disabled?: boolean;
    showMedia?: boolean;
    onImageClick?: (src: string) => void;
}

export default function OptionViewerSingleChoice({ options, value, onChange, disabled, showMedia = true, onImageClick }: OptionViewerProps) {
    return (
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
                        String(value) === String(key) ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
                        disabled && "cursor-default"
                    )}>
                    <RadioGroupItem value={key} id={`opt-${key}`} className={disabled ? "data-[state=checked]:text-blue-600 data-[state=checked]:bg-blue-600" : ""} />
                    <Label htmlFor={`opt-${key}`} className="flex-1 cursor-pointer font-normal">
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
                                            onImageClick?.(opt.media_url);
                                        }}
                                    />
                                </div>
                            )}
                            <MathRenderer content={opt.content} />
                        </div>
                    </Label>
                </div>
            ))}
        </RadioGroup>
    );
}
