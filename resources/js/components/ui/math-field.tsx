
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

export const MathField = ({ value, onChange, placeholder, readOnly, className, options }: MathFieldProps) => {
    const mfRef = useRef<MathfieldElement>(null);

    useEffect(() => {
        const mf = mfRef.current;
        if (!mf) return;

        // Apply options
        if (options) {
            mf.setOptions(options);
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
        const mf = mfRef.current;
        if (mf && value !== undefined && mf.value !== value) {
            mf.setValue(value);
        }
    }, [value]);

    return (
        <math-field
            ref={mfRef}
            class={className}
            style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: 'calc(var(--radius) - 2px)',
                border: '1px solid hsl(var(--input))',
                backgroundColor: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                fontSize: '1.2em'
            }}
        >
            {value}
        </math-field>
    );
};
