import React from 'react';
import { OptionViewerProps } from './OptionViewerSingleChoice';
import RichTextEditor from '@/components/ui/rich-text/RichTextEditor';

export default function OptionViewerEssay({ value, onChange, disabled }: OptionViewerProps) {
    return (
        <div className="space-y-2">
            <RichTextEditor
                value={value as string || ''}
                onChange={(html) => onChange(html)}
                placeholder="Ketik jawaban esai Anda di sini..."
                readOnly={disabled}
            />
        </div>
    );
}
