import React, { useEffect } from 'react';
import { Option } from './types';
import OptionEditorMultipleChoice from './OptionEditorMultipleChoice';
import OptionEditorTrueFalse from './OptionEditorTrueFalse';
import OptionEditorMatching from './OptionEditorMatching';
import OptionEditorOrdering from './OptionEditorOrdering';
import OptionEditorNumerical from './OptionEditorNumerical';

interface Props {
    type: string;
    options: Option[];
    onChange: (opts: Option[]) => void;
    errors?: any;
}

export default function OptionsEditor({ type, options, onChange, errors }: Props) {

    // Initialize default options if empty based on type
    useEffect(() => {
        if (options.length === 0) {
            initializeOptions(type);
        }
    }, [type]);

    const initializeOptions = (qType: string) => {
        if (options.length > 0) return; // Don't override if exists

        let newOps: Option[] = [];
        if (qType === 'multiple_choice' || qType === 'multiple_selection') {
            newOps = ['A', 'B', 'C', 'D'].map((key, i) => ({
                option_key: key,
                content: '',
                is_correct: false,
                order: i,
                media_url: null,
                media_file: null
            }));
        } else if (qType === 'true_false') {
            newOps = [
                { option_key: 'T', content: 'Benar', is_correct: true, order: 0, media_url: null, media_file: null },
                { option_key: 'F', content: 'Salah', is_correct: false, order: 1, media_url: null, media_file: null }
            ];
        } else if (qType === 'matching') {
            // 4 pairs default
            newOps = Array.from({ length: 4 }).flatMap((_, i) => [
                { option_key: `L${i + 1}`, content: '', is_correct: true, order: i * 2, metadata: { side: 'left', pair_id: i + 1, match_with: `R${i + 1}` }, media_url: null, media_file: null },
                { option_key: `R${i + 1}`, content: '', is_correct: true, order: i * 2 + 1, metadata: { side: 'right', pair_id: i + 1, match_with: `L${i + 1}` }, media_url: null, media_file: null }
            ]);
        } else if (qType === 'numerical_input') {
            newOps = [{ option_key: 'NUM', content: '', is_correct: true, order: 0, metadata: { tolerance: 0, unit: '' }, media_url: null, media_file: null }];
        }
        if (newOps.length > 0) onChange(newOps);
    };

    if (type === 'multiple_choice' || type === 'multiple_selection') {
        return <OptionEditorMultipleChoice type={type} options={options} onChange={onChange} errors={errors} />;
    }

    if (type === 'true_false') {
        return <OptionEditorTrueFalse options={options} onChange={onChange} errors={errors} />;
    }

    if (type === 'matching') {
        return <OptionEditorMatching options={options} onChange={onChange} errors={errors} />;
    }

    if (type === 'ordering') {
        return <OptionEditorOrdering options={options} onChange={onChange} errors={errors} />;
    }

    if (type === 'numerical_input') {
        return <OptionEditorNumerical options={options} onChange={onChange} errors={errors} />;
    }

    return <div className="text-muted-foreground italic">Editor untuk tipe soal ini belum tersedia.</div>;
}
