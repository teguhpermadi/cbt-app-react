
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ArabicNodeView } from './ArabicNodeView';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        arabicComponent: {
            /**
             * Add an arabic component
             */
            addArabicComponent: () => ReturnType;
        };
    }
}

export const ArabicExtension = Node.create({
    name: 'arabicComponent',

    group: 'inline',

    inline: true,

    atom: true,

    addAttributes() {
        return {
            text: {
                default: '',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="arabic-component"]',
            },
            {
                tag: 'arabic-component',
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'arabic-component' }), ''];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ArabicNodeView);
    },

    addCommands() {
        return {
            addArabicComponent:
                () =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: 'arabicComponent',
                            attrs: { text: '' },
                        });
                    },
        };
    },
});
