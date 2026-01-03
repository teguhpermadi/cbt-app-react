
import React, { useEffect, useRef } from 'react';
import 'mathlive';
import { MathfieldElement, MathfieldOptions } from 'mathlive';

interface MathFieldProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    readOnly?: boolean;
    className?: string;
    options?: Partial<MathfieldOptions>;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
        }
    }
}

export const MathField = React.forwardRef<MathfieldElement, MathFieldProps>(({ value, onChange, placeholder, readOnly, className, options }, ref) => {
    const internalRef = useRef<MathfieldElement>(null);

    React.useImperativeHandle(ref, () => internalRef.current as MathfieldElement);

    useEffect(() => {
        const mf = internalRef.current;
        if (!mf) return;

        // Apply options directly on the mathfield (MathLive 0.108.2+)
        if (options) {
            Object.entries(options).forEach(([key, value]) => {
                (mf as any)[key] = value;
            });
        }

        // Apply other props
        mf.readOnly = !!readOnly;
        if (placeholder) mf.placeholder = placeholder;
        if (value !== undefined && mf.value !== value) {
            mf.setValue(value);
        }

        // Listener for changes
        const handleInput = (evt: Event) => {
            if (onChange) {
                onChange((evt.target as MathfieldElement).value);
            }
        };

        mf.addEventListener('input', handleInput);

        return () => {
            mf.removeEventListener('input', handleInput);
        };
    }, [value, onChange, placeholder, readOnly, options]);

    // Handle updates when value prop changes externally
    useEffect(() => {
        const mf = internalRef.current;
        if (mf && value !== undefined && mf.value !== value) {
            mf.setValue(value, { suppressChangeNotifications: true });
        }
    }, [value]);

    return (
        <math-field
            ref={internalRef}
            class={className}
            style={{
                display: 'inline-block',
                width: 'auto', // Allow it to grow
                minWidth: '20px',
                padding: '0.2rem 0.5rem',
                borderRadius: 'calc(var(--radius) - 2px)',
                border: className?.includes('border-0') ? 'none' : '1px solid hsl(var(--input))',
                backgroundColor: className?.includes('bg-transparent') ? 'transparent' : 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                fontSize: '1em',
                ...((options as any)?.style || {})
            }}
        >
            {value}
        </math-field>
    );
});
MathField.displayName = "MathField";
