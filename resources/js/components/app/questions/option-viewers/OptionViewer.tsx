import React from 'react';
import OptionViewerSingleChoice from './OptionViewerSingleChoice';
import OptionViewerMultipleChoice from './OptionViewerMultipleChoice';
import OptionViewerTrueFalse from './OptionViewerTrueFalse';
import OptionViewerEssay from './OptionViewerEssay';
import OptionViewerNumericalInput from './OptionViewerNumericalInput';
import OptionViewerOrdering from './OptionViewerOrdering';
import OptionViewerMatching from './OptionViewerMatching';
import { AlertCircle } from 'lucide-react';

interface Props {
    type: string;
    options: any;
    value: any;
    onChange: (value: any) => void;
    disabled?: boolean;
}

export default function OptionViewer({ type, options, value, onChange, disabled }: Props) {
    switch (type) {
        case 'multiple_choice':
            return <OptionViewerSingleChoice options={options} value={value} onChange={onChange} disabled={disabled} />;

        case 'true_false':
            return <OptionViewerTrueFalse options={options} value={value} onChange={onChange} disabled={disabled} />;

        case 'multiple_selection':
            return <OptionViewerMultipleChoice options={options} value={value} onChange={onChange} disabled={disabled} />;

        case 'essay':
            return <OptionViewerEssay options={options} value={value} onChange={onChange} disabled={disabled} />;

        case 'numerical_input':
            return <OptionViewerNumericalInput options={options} value={value} onChange={onChange} disabled={disabled} />;

        case 'ordering':
            return <OptionViewerOrdering options={options} value={value} onChange={onChange} disabled={disabled} />;

        case 'matching':
            return <OptionViewerMatching options={options} value={value} onChange={onChange} disabled={disabled} />;

        default:
            return (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Tipe soal <strong>{type}</strong> belum didukung untuk ditampilkan.
                </div>
            );
    }
}
