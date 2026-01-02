
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MathNodeView } from './MathNodeView';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        mathComponent: {
            /**
             * Add a math component
             */
            addMathComponent: () => ReturnType;
        };
    }
}

export const MathExtension = Node.create({
    name: 'mathComponent',

    group: 'inline',

    inline: true,

    atom: true,

    addAttributes() {
        return {
            latex: {
                default: '\\text{Math}',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="math-component"]',
            },
            {
                tag: 'math-component',
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'math-component' }), ''];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MathNodeView);
    },

    addCommands() {
        return {
            addMathComponent:
                () =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: 'mathComponent',
                            attrs: { latex: '' },
                        });
                    },
        };
    },
});
