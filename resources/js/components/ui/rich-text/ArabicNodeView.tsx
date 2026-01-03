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
    const [input, setInput] = useState(props.node.attrs.text || ''); // Final saved text
    const [draftText, setDraftText] = useState(''); // Draft text while editing
    const [cursorPosition, setCursorPosition] = useState(0); // Track cursor position
    const [layoutName, setLayoutName] = useState('default'); // Track keyboard layout
    const lastPressedButton = useRef<string>(''); // Track last pressed button
    const isEditable = props.editor.isEditable;
    const nodeRef = useRef(null); // Ref for Draggable to avoid strict mode warnings
    const keyboardRef = useRef<any>(null); // Ref for Keyboard
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Sync local state if props change externally
        // ONLY if keyboard is NOT open. If it is open, user is typing, so ignore external updates to avoid overwriting.
        if (!open && props.node.attrs.text !== input) {
            setInput(props.node.attrs.text || '');
        }
    }, [props.node.attrs.text, open]);

    useEffect(() => {
        // Auto open if empty and editable (newly inserted)
        if (isEditable && !props.node.attrs.text) {
            setOpen(true);
        }
    }, []);

    // Sync keyboard internal buffer when opening
    useEffect(() => {
        if (open && keyboardRef.current) {
            // Load draft with current saved text
            keyboardRef.current.setInput(draftText);
            // Autofocus input when opened
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    }, [open]);

    // Use button press to determine what to insert
    const onVirtualChange = (newValue: string) => {
        // Only process if we have a valid button press
        if (!lastPressedButton.current) {
            return;
        }

        const button = lastPressedButton.current;
        lastPressedButton.current = ''; // Reset

        // Check if it's a special key
        if (button.startsWith('{')) {
            return; // Special keys handled in handleKeyPress
        }

        // Harakat characters (Arabic diacritics)
        const harakatChars = ['َ', 'ً', 'ُ', 'ٌ', 'ِ', 'ٍ', 'ْ', 'ّ'];
        const isHarakat = harakatChars.includes(button);

        let before = draftText.substring(0, cursorPosition);
        const after = draftText.substring(cursorPosition);

        // If pressing harakat and previous character is also harakat, replace it
        if (isHarakat && cursorPosition > 0) {
            const prevChar = before[before.length - 1];
            if (harakatChars.includes(prevChar)) {
                // Replace previous harakat with new one
                before = before.substring(0, before.length - 1);
            }
        }

        // Insert character at cursor position
        const result = before + button + after;

        setDraftText(result);
        keyboardRef.current?.setInput(result);

        // Move cursor after inserted character
        const newPos = before.length + button.length;
        setCursorPosition(newPos);

        setTimeout(() => {
            inputRef.current?.setSelectionRange(newPos, newPos);
            inputRef.current?.focus();
            keyboardRef.current?.setCaretPosition(newPos);
        }, 0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDraftText(val);
        // Update cursor position
        const pos = e.target.selectionStart || 0;
        setCursorPosition(pos);
        // Sync keyboard state
        keyboardRef.current?.setInput(val);
    };

    const syncCaretPosition = () => {
        // Helper function to sync caret position from Input to state
        const pos = inputRef.current?.selectionStart || 0;
        setCursorPosition(pos);
        keyboardRef.current?.setCaretPosition(pos);
    };

    const handleInputSelect = (e: React.SyntheticEvent<HTMLInputElement, Event>) => {
        // Sync virtual keyboard caret when user moves cursor in input
        syncCaretPosition();
    };

    const handleKeyPress = (button: string) => {
        // Special keys that should be handled by keyboard library
        if (button === "{shift}") {
            // Toggle layout between default and shift
            setLayoutName(current => current === 'default' ? 'shift' : 'default');
            return;
        }

        // Store the button that was pressed
        lastPressedButton.current = button;

        if (button === "{enter}") {
            lastPressedButton.current = '';
            handleSubmit();
            return;
        }

        if (button === "{escape}") {
            lastPressedButton.current = '';
            handleCancel();
            return;
        }

        if (button === "{bksp}") {
            lastPressedButton.current = '';
            // Handle backspace manually
            if (cursorPosition > 0) {
                const before = draftText.substring(0, cursorPosition - 1);
                const after = draftText.substring(cursorPosition);
                const result = before + after;

                setDraftText(result);
                keyboardRef.current?.setInput(result);

                const newPos = cursorPosition - 1;
                setCursorPosition(newPos);

                setTimeout(() => {
                    inputRef.current?.setSelectionRange(newPos, newPos);
                    inputRef.current?.focus();
                    keyboardRef.current?.setCaretPosition(newPos);
                }, 0);
            }
            return;
        }

        if (button === "{arrowleft}" || button === "{arrowright}") {
            // Sync current position first
            syncCaretPosition();

            const currentPos = inputRef.current?.selectionStart || 0;
            let newPos = currentPos;

            // RTL: Left arrow moves right logically (forward in string)
            // Right arrow moves left logically (backward in string)
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
        if (!open) {
            // Opening: initialize draft with current saved text
            setDraftText(input);
        }
        setOpen(!open);
    };

    const handleSubmit = () => {
        // Apply draft to final state
        setInput(draftText);
        props.updateAttributes({ text: draftText });
        setOpen(false);
    };

    const handleCancel = () => {
        // Discard draft and close
        setOpen(false);
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
                        <div ref={nodeRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border shadow-2xl rounded-xl w-[650px] max-w-[95vw] p-4 pointer-events-auto cursor-auto">
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
                                    value={draftText}
                                    onChange={handleInputChange}
                                    onSelect={handleInputSelect}
                                    onMouseUp={handleInputSelect} // Sync on click/drag
                                    onClick={handleInputSelect} // Sync on click
                                    onKeyUp={handleInputSelect} // Sync after keyboard navigation
                                    dir="rtl"
                                    className="font-arabic text-2xl h-12 text-right bg-slate-50 focus-visible:ring-1 focus-visible:ring-primary"
                                    placeholder="Type Arabic here..."
                                    autoFocus
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mb-4">
                                <Button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    size="lg"
                                >
                                    Submit
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="flex-1"
                                    size="lg"
                                >
                                    Cancel
                                </Button>
                            </div>

                            {/* style font pada keyboard virtual */}
                            <div className="arabic-keyboard-wrapper [&_.hg-theme-default]:bg-transparent [&_.hg-button]:h-14 [&_.hg-button]:text-2xl [&_.hg-button]:font-arabic [&_.hg-button]:font-medium">
                                <Keyboard
                                    keyboardRef={r => (keyboardRef.current = r)}
                                    onChange={onVirtualChange}
                                    onKeyPress={handleKeyPress}
                                    layoutName={layoutName}
                                    layout={{
                                        default: [
                                            "١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ ٠ - =",
                                            "ض ص ث ق ف غ ع ه خ ح ج د",
                                            "ش س ي ب ل ا ت ن م ك ط",
                                            "ئ ء ؤ ر لا ى ة و ز ظ",
                                            "َ ً ُ ٌ ِ ٍ ْ ّ",
                                            "{shift} {arrowright} {space} {arrowleft} {bksp}"
                                        ],
                                        shift: [
                                            "! @ # $ % ^ & * ) ( _ +",
                                            "َ ً ُ ٌ ِ ٍ ْ ّ > < |",
                                            "~ “ ” [ ] ، / : \" {enter}",
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
