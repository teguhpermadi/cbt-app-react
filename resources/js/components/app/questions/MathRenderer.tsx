import { useEffect, useRef } from "react";
import renderMathInElement from "katex/dist/contrib/auto-render";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

interface MathRendererProps {
    content: string;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * A reusable component that renders HTML content and automatically
 * processes any KaTeX math equations within it.
 */
export default function MathRenderer({ content, className, style }: MathRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && typeof content === 'string') {
            // Set the content
            containerRef.current.innerHTML = content;

            // Render math in the element
            renderMathInElement(containerRef.current, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        }
    }, [content]);

    return (
        <div
            ref={containerRef}
            className={cn("math-renderer", className)}
            style={style}
        />
    );
}
