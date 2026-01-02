
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { MathExtension } from './MathExtension';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline as UnderlineIcon, Sigma, List, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MathRichTextEditorProps {
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    readOnly?: boolean;
}

export default function MathRichTextEditor({ value, onChange, placeholder, className, readOnly = false }: MathRichTextEditorProps) {
    const editor = useEditor({
        editable: !readOnly,
        extensions: [
            StarterKit,
            TextStyle,
            Underline,
            MathExtension,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: cn(
                    'max-w-none focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
                    !readOnly ? 'min-h-[150px] p-4' : 'text-sm'
                ),
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className={cn("bg-background", !readOnly && "border rounded-md", className)}>
            {!readOnly && (
                <div className="flex flex-wrap items-center gap-1 border-b bg-muted/50 p-1">
                    <Button
                        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        title="Bold"
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        title="Italic"
                    >
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        title="Underline"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button
                        variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        title="Ordered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs font-medium gap-1 text-blue-600 dark:text-blue-400"
                        onClick={() => editor.chain().focus().addMathComponent().run()}
                        title="Insert Math Formula"
                    >
                        <Sigma className="h-4 w-4" />
                        Math
                    </Button>
                </div>
            )}
            <EditorContent editor={editor} />
        </div>
    );
}
