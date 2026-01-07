import React, { useState } from 'react';
import OptionViewerSingleChoice from './OptionViewerSingleChoice';
import OptionViewerMultipleChoice from './OptionViewerMultipleChoice';
import OptionViewerTrueFalse from './OptionViewerTrueFalse';
import OptionViewerEssay from './OptionViewerEssay';
import OptionViewerNumericalInput from './OptionViewerNumericalInput';
import OptionViewerOrdering from './OptionViewerOrdering';
import OptionViewerMatching from './OptionViewerMatching';
import OptionViewerWordCloud from './OptionViewerWordCloud';
import ImageViewerModal from '@/components/ui/image-viewer-modal';
import { AlertCircle } from 'lucide-react';

interface Props {
    type: string;
    options: any;
    value: any;
    onChange: (value: any) => void;
    disabled?: boolean;
    showMedia?: boolean;
}

export default function OptionViewer({ type, options, value, onChange, disabled, showMedia = true }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handleImageClick = (src: string) => {
        setPreviewImage(src);
        setIsModalOpen(true);
    };

    const commonProps = {
        options,
        value,
        onChange,
        disabled,
        showMedia,
        onImageClick: handleImageClick,
    };

    const renderViewer = () => {
        switch (type) {
            case 'multiple_choice':
                // Ensure value is a string, not an array
                const singleValue = Array.isArray(value) && value.length > 0 ? value[0] : value;
                return <OptionViewerSingleChoice {...commonProps} value={singleValue} />;

            case 'true_false':
                // True/False also uses SingleChoice viewer
                const tfValue = Array.isArray(value) && value.length > 0 ? value[0] : value;
                return <OptionViewerTrueFalse {...commonProps} value={tfValue} />;

            case 'multiple_selection':
                return <OptionViewerMultipleChoice {...commonProps} />;

            case 'essay':
                return <OptionViewerEssay {...commonProps} />;

            case 'numerical_input':
                return <OptionViewerNumericalInput {...commonProps} />;

            case 'ordering':
                return <OptionViewerOrdering {...commonProps} />;

            case 'matching':
                return <OptionViewerMatching {...commonProps} />;

            case 'word_cloud':
                return <OptionViewerWordCloud {...commonProps} />;

            default:
                return (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Tipe soal <strong>{type}</strong> belum didukung untuk ditampilkan.
                    </div>
                );
        }
    };

    return (
        <>
            {renderViewer()}
            <ImageViewerModal
                src={previewImage}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
