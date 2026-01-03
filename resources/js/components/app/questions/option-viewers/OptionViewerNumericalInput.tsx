import React from 'react';
import { MathField } from '@/components/ui/math-field';
import { OptionViewerProps } from './OptionViewerSingleChoice';

export default function OptionViewerNumericalInput({ value, onChange, disabled }: OptionViewerProps) {
    return (
        <div className="space-y-2">
            <MathField
                className="w-full p-4 text-lg border rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Masukkan jawaban angka atau formula matematika..."
                value={value as string || ''}
                onChange={(newValue) => onChange(newValue)}
                readOnly={disabled}
                // options={{
                //     smartMode: true,
                //     mathModeSpace: '\\:',
                // }}
            />
        </div>
    );
}
