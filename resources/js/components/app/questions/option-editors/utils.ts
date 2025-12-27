import { Option } from './types';

export const generateDefaultOptions = (type: string): Option[] => {
    switch (type) {
        case 'multiple_choice':
        case 'multiple_selection':
            return ['A', 'B', 'C', 'D'].map((key, i) => ({
                option_key: key,
                content: '',
                is_correct: false,
                order: i,
                media_url: null,
                media_file: null
            }));

        case 'true_false':
            return [
                { option_key: 'T', content: 'Benar', is_correct: true, order: 0, media_url: null, media_file: null },
                { option_key: 'F', content: 'Salah', is_correct: false, order: 1, media_url: null, media_file: null }
            ];

        case 'matching':
            // 4 pairs default
            return Array.from({ length: 4 }).flatMap((_, i) => [
                {
                    option_key: `L${i + 1}`,
                    content: '',
                    is_correct: true,
                    order: i * 2,
                    metadata: { side: 'left', pair_id: i + 1, match_with: `R${i + 1}` },
                    media_url: null,
                    media_file: null
                },
                {
                    option_key: `R${i + 1}`,
                    content: '',
                    is_correct: true,
                    order: i * 2 + 1,
                    metadata: { side: 'right', pair_id: i + 1, match_with: `L${i + 1}` },
                    media_url: null,
                    media_file: null
                }
            ]);

        case 'ordering':
            return [
                { option_key: '1', content: '', is_correct: true, order: 0, media_url: null, media_file: null },
                { option_key: '2', content: '', is_correct: true, order: 1, media_url: null, media_file: null },
                { option_key: '3', content: '', is_correct: true, order: 2, media_url: null, media_file: null },
                { option_key: '4', content: '', is_correct: true, order: 3, media_url: null, media_file: null },
            ];

        case 'numerical_input':
            return [{
                option_key: 'NUM',
                content: '',
                is_correct: true,
                order: 0,
                metadata: { tolerance: 0, unit: '' },
                media_url: null,
                media_file: null
            }];

        case 'essay':
        case 'short_answer':
            return []; // No fixed options for essay

        default:
            return [];
    }
};
