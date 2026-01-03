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
import { Checkbox } from '@/components/ui/checkbox';

// Javanese character transliteration mapping
const TRANSLITERATION_MAP: Record<string, string> = {
    'ꦲ': 'ha', 'ꦤ': 'na', 'ꦕ': 'ca', 'ꦫ': 'ra', 'ꦏ': 'ka',
    'ꦢ': 'da', 'ꦠ': 'ta', 'ꦱ': 'sa', 'ꦮ': 'wa', 'ꦭ': 'la',
    'ꦥ': 'pa', 'ꦝ': 'dha', 'ꦗ': 'ja', 'ꦪ': 'ya', 'ꦚ': 'nya',
    'ꦩ': 'ma', 'ꦒ': 'ga', 'ꦧ': 'ba', 'ꦛ': 'tha', 'ꦔ': 'nga',
    // Sandhangan (vowels)
    'ꦴ': 'aa', 'ꦶ': 'i', 'ꦸ': 'u', 'ꦺ': 'e', 'ꦼ': 'ê',
    'ꦺꦴ': 'o', 'ꦻ': 'ai', 'ꦄꦆ': 'au',
    // Numbers
    '꧐': '0', '꧑': '1', '꧒': '2', '꧓': '3', '꧔': '4',
    '꧕': '5', '꧖': '6', '꧗': '7', '꧘': '8', '꧙': '9',
};

export const JavaneseNodeView = (props: NodeViewProps) => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState(props.node.attrs.text || '');
    const [draftText, setDraftText] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const [layoutName, setLayoutName] = useState('default');
    const [showTransliteration, setShowTransliteration] = useState(props.node.attrs.showTransliteration || false);
    const lastPressedButton = useRef<string>('');
    const isEditable = props.editor.isEditable;
    const nodeRef = useRef(null);
    const keyboardRef = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open && props.node.attrs.text !== input) {
            setInput(props.node.attrs.text || '');
        }
        if (props.node.attrs.showTransliteration !== showTransliteration) {
            setShowTransliteration(props.node.attrs.showTransliteration || false);
        }
    }, [props.node.attrs.text, props.node.attrs.showTransliteration, open]);

    useEffect(() => {
        if (isEditable && !props.node.attrs.text) {
            setOpen(true);
        }
    }, []);

    useEffect(() => {
        if (open && keyboardRef.current) {
            keyboardRef.current.setInput(draftText);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    }, [open]);

    const getTransliteration = (text: string): string => {
        return text.split('').map(char => TRANSLITERATION_MAP[char] || char).join(' ');
    };

    // Generate display mapping for keyboard buttons with optional transliteration
    const getKeyboardDisplay = () => {
        const baseDisplay = {
            "{bksp}": "⌫",
            "{enter}": "Done",
            "{shift}": "⇧",
            "{space}": " ",
            "{escape}": "Esc",
            "{arrowleft}": "←",
            "{arrowright}": "→"
        };

        if (!showTransliteration) {
            return baseDisplay;
        }

        // Add transliteration for each character
        const displayWithTranslit: Record<string, string> = { ...baseDisplay };

        // Get all unique characters from both layouts
        const allChars = new Set<string>();
        const layouts = [
            ["꧐", "꧑", "꧒", "꧓", "꧔", "꧕", "꧖", "꧗", "꧘", "꧙"],
            ["ꦲ", "ꦤ", "ꦕ", "ꦫ", "ꦏ", "ꦢ", "ꦠ", "ꦱ", "ꦮ", "ꦭ"],
            ["ꦥ", "ꦝ", "ꦗ", "ꦪ", "ꦚ", "ꦩ", "ꦒ", "ꦧ", "ꦛ", "ꦔ"],
            ["ꦴ", "ꦶ", "ꦸ", "ꦺ", "ꦼ", "ꦺꦴ", "ꦻ", "ꦄꦆ"],
            ["ꦲ꧀", "ꦤ꧀", "ꦕ꧀", "ꦫ꧀", "ꦏ꧀", "ꦢ꧀", "ꦠ꧀", "ꦱ꧀", "ꦮ꧀", "ꦭ꧀"],
            ["ꦥ꧀", "ꦝ꧀", "ꦗ꧀", "ꦪ꧀", "ꦚ꧀", "ꦩ꧀", "ꦒ꧀", "ꦧ꧀", "ꦛ꧀", "ꦔ꧀"],
            ["꧁", "꧂", "꧃", "꧄", "꧅", "꧆", "꧇", "꧈", "꧉"]
        ];

        layouts.forEach(row => {
            row.forEach(char => {
                const translit = TRANSLITERATION_MAP[char] || TRANSLITERATION_MAP[char.charAt(0)];
                if (translit) {
                    // Use newline character for 2-line display
                    displayWithTranslit[char] = `${char}\n${translit}`;
                }
            });
        });

        return displayWithTranslit;
    };

    const onVirtualChange = (newValue: string) => {
        if (!lastPressedButton.current) {
            return;
        }

        const button = lastPressedButton.current;
        lastPressedButton.current = '';

        // Clean button value - remove any newline or transliteration text
        // The button value should only be the Javanese character, not the display text
        const cleanButton = button.split('\n')[0]; // Take only first line if there's newline

        if (cleanButton.startsWith('{')) {
            return;
        }

        // Sandhangan characters (vowel marks)
        const sandhanganChars = ['ꦴ', 'ꦶ', 'ꦸ', 'ꦺ', 'ꦼ', 'ꦺꦴ', 'ꦻ', 'ꦄꦆ'];
        const isSandhangan = sandhanganChars.includes(cleanButton);

        let before = draftText.substring(0, cursorPosition);
        const after = draftText.substring(cursorPosition);

        // If pressing sandhangan and previous character is also sandhangan, replace it
        if (isSandhangan && cursorPosition > 0) {
            const prevChar = before[before.length - 1];
            if (sandhanganChars.includes(prevChar)) {
                before = before.substring(0, before.length - 1);
            }
        }

        const result = before + cleanButton + after;

        setDraftText(result);
        keyboardRef.current?.setInput(result);

        const newPos = before.length + cleanButton.length;
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
        const pos = e.target.selectionStart || 0;
        setCursorPosition(pos);
        keyboardRef.current?.setInput(val);
    };

    const syncCaretPosition = () => {
        const pos = inputRef.current?.selectionStart || 0;
        setCursorPosition(pos);
        keyboardRef.current?.setCaretPosition(pos);
    };

    const handleInputSelect = (e: React.SyntheticEvent<HTMLInputElement, Event>) => {
        syncCaretPosition();
    };

    const handleKeyPress = (button: string) => {
        if (button === "{shift}") {
            setLayoutName(current => current === 'default' ? 'shift' : 'default');
            return;
        }

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
            syncCaretPosition();

            const currentPos = inputRef.current?.selectionStart || 0;
            let newPos = currentPos;

            if (button === "{arrowleft}") {
                newPos = Math.max(0, currentPos - 1);
            } else if (button === "{arrowright}") {
                newPos = Math.min(draftText.length, currentPos + 1);
            }

            inputRef.current?.setSelectionRange(newPos, newPos);
            inputRef.current?.focus();
            keyboardRef.current?.setCaretPosition(newPos);
            return;
        }
    };

    const toggleOpen = () => {
        if (!isEditable) return;
        if (!open) {
            setDraftText(input);
        }
        setOpen(!open);
    };

    const handleSubmit = () => {
        setInput(draftText);
        props.updateAttributes({ text: draftText, showTransliteration });
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <NodeViewWrapper className="inline-block align-middle mx-1">
            <div
                onClick={toggleOpen}
                className={cn(
                    "relative inline-flex flex-col items-center justify-center min-w-[60px] min-h-[30px] px-2 py-1 rounded cursor-pointer transition-all",
                    isEditable ? "bg-orange-50 hover:bg-orange-100 border border-orange-200" : "bg-transparent",
                    !input && isEditable ? "text-muted-foreground" : "text-foreground",
                    open && isEditable && "ring-2 ring-orange-500 ring-offset-2"
                )}
            >
                {input ? (
                    <span className="text-xl font-medium font-javanese">{input}</span>
                ) : (
                    <span className="text-sm italic opacity-50">Javanese...</span>
                )}

                {isEditable && (
                    <div className="absolute -top-2 -right-2 bg-orange-100 text-[8px] px-1 rounded text-orange-700 border border-orange-200 select-none">JW</div>
                )}
            </div>

            {open && isEditable && createPortal(
                <div className="fixed inset-0 z-[9999] pointer-events-none">
                    <Draggable nodeRef={nodeRef} handle=".drag-handle">
                        <div ref={nodeRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border shadow-2xl rounded-xl w-[700px] max-w-[95vw] p-4 pointer-events-auto cursor-auto">
                            <div className="flex justify-between items-center mb-3 border-b pb-2 drag-handle cursor-move">
                                <div className="flex items-center gap-2">
                                    <Move className="h-4 w-4 text-muted-foreground" />
                                    <KeyboardIcon className="h-4 w-4 text-primary" />
                                    <span className="font-semibold text-sm select-none">Javanese Keyboard (Hanacaraka)</span>
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
                                    onMouseUp={handleInputSelect}
                                    onClick={handleInputSelect}
                                    onKeyUp={handleInputSelect}
                                    className="font-javanese text-2xl h-12 bg-slate-50 focus-visible:ring-1 focus-visible:ring-primary"
                                    placeholder="Type Javanese here..."
                                    autoFocus
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                />
                            </div>

                            {/* Transliteration Toggle */}
                            <div className="flex items-center gap-2 mb-4">
                                <Checkbox
                                    id="show-transliteration"
                                    checked={showTransliteration}
                                    onCheckedChange={(checked) => setShowTransliteration(checked as boolean)}
                                />
                                <label htmlFor="show-transliteration" className="text-sm cursor-pointer select-none">
                                    Show Transliteration
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mb-4">
                                <Button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
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

                            {/* Virtual Keyboard */}
                            <div className={cn(
                                "javanese-keyboard-wrapper [&_.hg-theme-default]:bg-transparent [&_.hg-button]:font-javanese [&_.hg-button]:font-medium",
                                showTransliteration
                                    ? "[&_.hg-button]:h-20 [&_.hg-button]:min-w-[3.5rem] [&_.hg-button]:text-base [&_.hg-button]:p-1"
                                    : "[&_.hg-button]:h-16 [&_.hg-button]:min-w-[3rem] [&_.hg-button]:text-2xl [&_.hg-button]:leading-tight"
                            )}>
                                <Keyboard
                                    keyboardRef={r => (keyboardRef.current = r)}
                                    onChange={onVirtualChange}
                                    onKeyPress={handleKeyPress}
                                    layoutName={layoutName}
                                    layout={{
                                        default: [
                                            "꧐ ꧑ ꧒ ꧓ ꧔ ꧕ ꧖ ꧗ ꧘ ꧙",
                                            "ꦲ ꦤ ꦕ ꦫ ꦏ ꦢ ꦠ ꦱ ꦮ ꦭ",
                                            "ꦥ ꦝ ꦗ ꦪ ꦚ ꦩ ꦒ ꦧ ꦛ ꦔ",
                                            "ꦴ ꦶ ꦸ ꦺ ꦼ ꦺꦴ ꦻ ꦄꦆ",
                                            "{shift} {arrowleft} {arrowright} {space} {bksp}"
                                        ],
                                        shift: [
                                            "ꦲ꧀ ꦤ꧀ ꦕ꧀ ꦫ꧀ ꦏ꧀ ꦢ꧀ ꦠ꧀ ꦱ꧀ ꦮ꧀ ꦭ꧀",
                                            "ꦥ꧀ ꦝ꧀ ꦗ꧀ ꦪ꧀ ꦚ꧀ ꦩ꧀ ꦒ꧀ ꦧ꧀ ꦛ꧀ ꦔ꧀",
                                            "꧁ ꧂ ꧃ ꧄ ꧅ ꧆ ꧇ ꧈ ꧉",
                                            "{shift} {arrowleft} {arrowright} {space} {bksp}"
                                        ]
                                    }}
                                    display={getKeyboardDisplay()}
                                    theme="hg-theme-default hg-layout-default myTheme"
                                    inputName="javanese"
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
