import React from 'react';
import { Input } from '@/components/ui/input';
import { OptionViewerProps } from './OptionViewerSingleChoice';

export default function OptionViewerNumericalInput({ value, onChange, disabled }: OptionViewerProps) {
    return (
        <div className="space-y-2">
            <Input
                type="number"
                className="w-full p-4 text-lg border rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Masukkan jawaban angka..."
                value={value as string || ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            />
        </div>
    );
}
