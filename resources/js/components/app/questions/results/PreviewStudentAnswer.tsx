import React from 'react';
import PreviewStudentAnswerMultipleChoice from "./PreviewStudentAnswerMultipleChoice";
import PreviewStudentAnswerMultipleSelection from "./PreviewStudentAnswerMultipleSelection";
import PreviewStudentAnswerMatching from "./PreviewStudentAnswerMatching";
import PreviewStudentAnswerTrueFalse from "./PreviewStudentAnswerTrueFalse";
import PreviewStudentAnswerOrdering from "./PreviewStudentAnswerOrdering";
import PreviewStudentAnswerNumericalInput from "./PreviewStudentAnswerNumericalInput";

interface PreviewStudentAnswerProps {
    type: 'multiple_choice' | 'multiple_selection' | 'true_false' | 'matching' | 'ordering' | 'numerical_input' | string;
    options: any;
    studentAnswer: any;
    keyAnswer: any;
    showMedia?: boolean;
    showKeyAnswer?: boolean;
    showStudentAnswer?: boolean;
}

export default function PreviewStudentAnswer({
    type,
    options,
    studentAnswer,
    keyAnswer,
    showMedia = false,
    showKeyAnswer = true,
    showStudentAnswer = true
}: PreviewStudentAnswerProps) {
    switch (type) {
        case 'multiple_choice':
            return (
                <PreviewStudentAnswerMultipleChoice
                    options={options}
                    studentAnswer={studentAnswer}
                    keyAnswer={keyAnswer}
                    showMedia={showMedia}
                    showKeyAnswer={showKeyAnswer}
                    showStudentAnswer={showStudentAnswer}
                />
            );
        case 'multiple_selection':
            return (
                <PreviewStudentAnswerMultipleSelection
                    options={options}
                    studentAnswer={studentAnswer}
                    keyAnswer={keyAnswer}
                    showMedia={showMedia}
                    showKeyAnswer={showKeyAnswer}
                    showStudentAnswer={showStudentAnswer}
                />
            );
        case 'true_false':
            return (
                <PreviewStudentAnswerTrueFalse
                    options={options}
                    studentAnswer={studentAnswer}
                    keyAnswer={keyAnswer}
                    showMedia={showMedia}
                    showKeyAnswer={showKeyAnswer}
                    showStudentAnswer={showStudentAnswer}
                />
            );
        case 'ordering':
            return (
                <PreviewStudentAnswerOrdering
                    options={options}
                    studentAnswer={studentAnswer}
                    keyAnswer={keyAnswer}
                    showMedia={showMedia}
                    showKeyAnswer={showKeyAnswer}
                    showStudentAnswer={showStudentAnswer}
                />
            );
        case 'matching':
            return (
                <PreviewStudentAnswerMatching
                    options={options}
                    studentAnswer={studentAnswer}
                    keyAnswer={keyAnswer}
                    showMedia={showMedia}
                    showKeyAnswer={showKeyAnswer}
                    showStudentAnswer={showStudentAnswer}
                />
            );
        case 'numerical_input':
            return (
                <PreviewStudentAnswerNumericalInput
                    studentAnswer={studentAnswer}
                    keyAnswer={keyAnswer}
                    showKeyAnswer={showKeyAnswer}
                    showStudentAnswer={showStudentAnswer}
                />
            );
        default:
            return (
                <div className="text-sm">
                    {typeof studentAnswer === 'object' ? JSON.stringify(studentAnswer) : (studentAnswer || '-')}
                </div>
            );
    }
}
