import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TagAutocompleteProps {
    onSelect: (tag: string) => void;
    placeholder?: string;
    className?: string;
}

export function TagAutocomplete({
    onSelect,
    placeholder = "Add tag...",
    className,
}: TagAutocompleteProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [debouncedValue] = useDebounce(inputValue, 300);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (debouncedValue.trim().length === 0) {
            setSuggestions([]);
            return;
        }

        const fetchTags = async () => {
            setLoading(true);
            try {
                // Ensure to import axios or use fetch. Laravel breeze/started usually has window.axios but importing axios is safer for TS.
                // Assuming global axios is available or installed. 'axios' is not in checked package.json properly? 
                // Wait, checked package.json - NO 'axios' in dependencies! 
                // But typically it comes with Laravel setup. 
                // Let's check window.axios or just use fetch.
                // 'laravel-vite-plugin' is there.
                // Use fetch to be safe.

                const response = await fetch(`/admin/tags/search?query=${encodeURIComponent(debouncedValue)}`, {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data);
                }
            } catch (error) {
                console.error("Failed to fetch tags", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, [debouncedValue]);

    const handleSelect = (tag: string) => {
        onSelect(tag);
        setInputValue("");
        setOpen(false);
        setSuggestions([]);
        // Keep focus?
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (inputValue.trim()) {
                handleSelect(inputValue.trim());
            }
        }
    };

    return (
        <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className={cn("relative w-full", className)}>
                    <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setOpen(true);
                        }}
                        onFocus={() => {
                            if (suggestions.length > 0) setOpen(true);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="h-8 text-sm"
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="p-1 w-[200px]"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="max-h-[200px] overflow-y-auto">
                    {suggestions.map((tag, index) => (
                        <div
                            key={`${tag}-${index}`}
                            onClick={() => handleSelect(tag)}
                            className="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                        >
                            {tag}
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
