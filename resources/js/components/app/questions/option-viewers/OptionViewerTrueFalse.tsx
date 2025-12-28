import React from 'react';
import OptionViewerSingleChoice, { OptionViewerProps } from './OptionViewerSingleChoice';

export default function OptionViewerTrueFalse(props: OptionViewerProps) {
    // True/False is essentially a Single Choice
    return <OptionViewerSingleChoice {...props} />;
}
