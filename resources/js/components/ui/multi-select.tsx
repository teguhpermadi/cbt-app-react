
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface MultiSelectProps {
    options: { label: string; value: string }[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    disabled?: boolean
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = "Select items...",
    disabled = false,
}: MultiSelectProps) {
    const selectedValues = new Set(value)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className="w-full justify-between h-auto min-h-10 py-2"
                >
                    <div className="flex flex-wrap gap-1">
                        {value.length > 0 ? (
                            value.map((val) => (
                                <Badge key={val} variant="secondary" className="mr-1">
                                    {options.find((opt) => opt.value === val)?.label || val}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground font-normal">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
                {options.map((option) => (
                    <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={selectedValues.has(option.value)}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                onChange([...value, option.value])
                            } else {
                                onChange(value.filter((v) => v !== option.value))
                            }
                        }}
                    >
                        {option.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
