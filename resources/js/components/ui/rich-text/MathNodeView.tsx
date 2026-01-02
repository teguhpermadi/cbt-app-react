
import React, { useRef, useEffect } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { MathField } from '@/components/ui/math-field';
import { MathfieldElement } from 'mathlive';

export const MathNodeView = (props: NodeViewProps) => {
    const mathRef = useRef<MathfieldElement>(null);

    const handleChange = (val: string) => {
        // Only update if value changed to avoid loops
        if (props.node.attrs.latex !== val) {
            props.updateAttributes({
                latex: val,
            });
        }
    };

    useEffect(() => {
        // Focus if newly created (empty) or specifically needed
        // We rely on content being empty for new inserts
        if (!props.node.attrs.latex && mathRef.current) {
            setTimeout(() => {
                mathRef.current?.focus();
            }, 50);
        }
    }, []);

    const isEditable = props.editor.isEditable;

    return (
        <NodeViewWrapper className="inline-block align-middle mx-1">
            <div className={`relative ${isEditable ? 'border rounded px-2 py-1 bg-slate-50 border-slate-200 min-w-[120px]' : ''} inline-block`}>
                <MathField
                    ref={mathRef}
                    value={props.node.attrs.latex}
                    onChange={handleChange}
                    readOnly={!isEditable}
                    className={`!p-0 !border-0 !bg-transparent text-lg shadow-none focus:ring-0 block ${!isEditable ? '!w-auto' : '!w-full'}`}
                    options={{
                        smartFence: true,
                        virtualKeyboardMode: 'manual',
                    }}
                />
                {isEditable && (
                    <div className="absolute -top-3 -right-2 bg-slate-200 text-[10px] px-1.5 rounded-full text-slate-600 select-none pointer-events-none border border-slate-300">Math</div>
                )}
            </div>
        </NodeViewWrapper>
    );
};
