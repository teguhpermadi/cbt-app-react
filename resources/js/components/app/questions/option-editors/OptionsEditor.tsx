import React, { useEffect } from 'react';
import { Option } from './types';
import { generateDefaultOptions } from './utils';
import OptionEditorMultipleChoice from './OptionEditorMultipleChoice';
import OptionEditorTrueFalse from './OptionEditorTrueFalse';
import OptionEditorMatching from './OptionEditorMatching';
import OptionEditorOrdering from './OptionEditorOrdering';
import OptionEditorNumerical from './OptionEditorNumerical';
import OptionEditorEssay from './OptionEditorEssay';
import OptionEditorWordCloud from './OptionEditorWordCloud';

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
        const newOps = generateDefaultOptions(qType);
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

    if (type === 'essay') {
        return <OptionEditorEssay options={options} onChange={onChange} errors={errors} />;
    }

    if (type === 'word_cloud') {
        return <OptionEditorWordCloud options={options} onChange={onChange} errors={errors} />;
    }

    return <div className="text-muted-foreground italic">Editor untuk tipe soal ini belum tersedia.</div>;
}
