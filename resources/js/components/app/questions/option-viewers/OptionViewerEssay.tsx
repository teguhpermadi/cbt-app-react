import React from 'react';
import { OptionViewerProps } from './OptionViewerSingleChoice';

export default function OptionViewerEssay({ value, onChange, disabled }: OptionViewerProps) {
    return (
        <div className="space-y-2">
            <textarea
                className="w-full min-h-[200px] p-4 border rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                placeholder="Ketik jawaban esai Anda di sini..."
                value={value as string || ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            />
        </div>
    );
}
