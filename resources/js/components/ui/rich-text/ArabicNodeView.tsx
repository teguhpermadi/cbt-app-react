import React, { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { createPortal } from 'react-dom';
import Keyboard from 'react-simple-keyboard';
import Draggable from 'react-draggable';
import 'react-simple-keyboard/build/css/index.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Keyboard as KeyboardIcon, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ArabicNodeView = (props: NodeViewProps) => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState(props.node.attrs.text || '');
    const isEditable = props.editor.isEditable;
    const nodeRef = useRef(null); // Ref for Draggable to avoid strict mode warnings
    const keyboardRef = useRef<any>(null); // Ref for Keyboard
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Sync local state if props change externally
        if (props.node.attrs.text !== input) {
            setInput(props.node.attrs.text || '');
        }
    }, [props.node.attrs.text]);

    useEffect(() => {
        // Auto open if empty and editable (newly inserted)
        if (isEditable && !props.node.attrs.text) {
            setOpen(true);
        }
    }, []);

    // Sync keyboard internal buffer when opening
    useEffect(() => {
        if (open && keyboardRef.current) {
            keyboardRef.current.setInput(input);
            // Autofocus input when opened
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    }, [open]);

    const onVirtualChange = (input: string) => {
        setInput(input);
        props.updateAttributes({ text: input });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInput(val);
        props.updateAttributes({ text: val });
        keyboardRef.current?.setInput(val);
    };

    const handleInputSelect = (e: React.SyntheticEvent<HTMLInputElement, Event>) => {
        // Sync virtual keyboard caret when user moves cursor in input
        const target = e.target as HTMLInputElement;
        keyboardRef.current?.setCaretPosition(target.selectionStart);
    };

    const handleKeyPress = (button: string) => {
        if (button === "{enter}" || button === "{escape}") {
            setOpen(false);
            return;
        }

        if (button === "{arrowleft}" || button === "{arrowright}") {
            const currentPos = inputRef.current?.selectionStart || 0;
            let newPos = currentPos;

            // In RTL context:
            // Visual Left Arrow -> Logic: Move Forward (Increment) -> Visual Left
            // Visual Right Arrow -> Logic: Move Backward (Decrement) -> Visual Right

            if (button === "{arrowleft}") {
                newPos = Math.min(input.length, currentPos + 1);
            } else if (button === "{arrowright}") {
                newPos = Math.max(0, currentPos - 1);
            }

            // Update Input Cursor
            inputRef.current?.setSelectionRange(newPos, newPos);
            inputRef.current?.focus();

            // Sync Virtual Keyboard Cursor
            keyboardRef.current?.setCaretPosition(newPos);
            return;
        }
    };

    const toggleOpen = () => {
        if (!isEditable) return;
        setOpen(!open);
    };

    return (
        <NodeViewWrapper className="inline-block align-middle mx-1">
            <div
                onClick={toggleOpen}
                className={cn(
                    "relative inline-flex items-center justify-center min-w-[60px] min-h-[30px] px-2 py-1 rounded cursor-pointer transition-all",
                    isEditable ? "bg-green-50 hover:bg-green-100 border border-green-200" : "bg-transparent",
                    !input && isEditable ? "text-muted-foreground" : "text-foreground",
                    open && isEditable && "ring-2 ring-green-500 ring-offset-2"
                )}
            >
                {input ? (
                    <span className="text-xl font-medium font-arabic" dir="rtl">{input}</span>
                ) : (
                    <span className="text-sm italic opacity-50">Arabic...</span>
                )}

                {isEditable && (
                    <div className="absolute -top-2 -right-2 bg-green-100 text-[8px] px-1 rounded text-green-700 border border-green-200 select-none">AR</div>
                )}
            </div>

            {open && isEditable && createPortal(
                <div className="fixed inset-0 z-[9999] pointer-events-none">
                    {/* Backdrop is removed to allow interaction with editor while keyboard is open, 
                        BUT we might want a click-outside handler if desired. 
                        For now, leaving it fully floating/interactive. 
                        User can close via X button. 
                      */}

                    <Draggable nodeRef={nodeRef} handle=".drag-handle">
                        <div ref={nodeRef} className="absolute left-1/2 top-2/3 -translate-x-1/2 bg-background border shadow-2xl rounded-xl w-[650px] max-w-[95vw] p-4 pointer-events-auto cursor-auto">
                            <div className="flex justify-between items-center mb-3 border-b pb-2 drag-handle cursor-move">
                                <div className="flex items-center gap-2">
                                    <Move className="h-4 w-4 text-muted-foreground" />
                                    <KeyboardIcon className="h-4 w-4 text-primary" />
                                    <span className="font-semibold text-sm select-none">Arabic Keyboard</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={() => setOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="mb-4">
                                <Input
                                    ref={inputRef}
                                    value={input}
                                    onChange={handleInputChange}
                                    onSelect={handleInputSelect}
                                    dir="rtl"
                                    className="font-arabic text-2xl h-12 text-right bg-slate-50 focus-visible:ring-1 focus-visible:ring-primary"
                                    placeholder="Type Arabic here..."
                                    autoFocus
                                />
                            </div>

                            <div className="arabic-keyboard-wrapper [&_.hg-theme-default]:bg-transparent [&_.hg-button]:h-10 [&_.hg-button]:text-lg [&_.hg-button]:font-arabic">
                                <Keyboard
                                    keyboardRef={r => (keyboardRef.current = r)}
                                    onChange={onVirtualChange}
                                    onKeyPress={handleKeyPress}
                                    layoutName="default"
                                    layout={{
                                        default: [
                                            "1 2 3 4 5 6 7 8 9 0 - =",
                                            "ض ص ث ق ف غ ع ه خ ح ج د \\",
                                            "ش س ي ب ل ا ت ن م ك ط",
                                            "ئ ء ؤ ر لا ى ة و ز ظ",
                                            "َ ً ُ ٌ ِ ٍ ْ ّ",
                                            "{shift} {arrowright} {space} {arrowleft} {bksp}"
                                        ],
                                        shift: [
                                            "! @ # $ % ^ & * ) ( _ +",
                                            "َ ً ُ ٌ ِ ٍ ْ ّ > < |",
                                            "~ “ ” [ ] ، / : \" ‘ {enter}",
                                            "{shift} {arrowright} {space} {arrowleft} {bksp}"
                                        ]
                                    }}
                                    display={{
                                        "{bksp}": "⌫",
                                        "{enter}": "Done",
                                        "{shift}": "⇧",
                                        "{space}": " ",
                                        "{escape}": "Esc",
                                        "{arrowleft}": "←",
                                        "{arrowright}": "→"
                                    }}
                                    theme="hg-theme-default hg-layout-default myTheme"
                                    inputName="arabic"
                                    value={input}
                                    rtl={true}
                                />
                            </div>
                        </div>
                    </Draggable>
                </div>,
                document.body
            )}
        </NodeViewWrapper>
    );
};
