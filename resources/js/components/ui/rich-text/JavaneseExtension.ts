
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { JavaneseNodeView } from './JavaneseNodeView';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        javaneseComponent: {
            /**
             * Add a javanese component
             */
            addJavaneseComponent: () => ReturnType;
        };
    }
}

export const JavaneseExtension = Node.create({
    name: 'javaneseComponent',

    group: 'inline',

    inline: true,

    atom: true,

    addAttributes() {
        return {
            text: {
                default: '',
            },
            showTransliteration: {
                default: false,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="javanese-component"]',
            },
            {
                tag: 'javanese-component',
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'javanese-component' }), ''];
    },

    addNodeView() {
        return ReactNodeViewRenderer(JavaneseNodeView);
    },

    addCommands() {
        return {
            addJavaneseComponent:
                () =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: 'javaneseComponent',
                            attrs: { text: '', showTransliteration: false },
                        });
                    },
        };
    },
});
