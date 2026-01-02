import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState, useId } from "react"
import { Spinner } from "@/components/ui/spinner"
import { router } from '@inertiajs/react';

const QUESTION_TYPES = [
    { id: 'multiple_choice', label: 'Multiple Choice' },
    { id: 'multiple_selection', label: 'Multiple Selection' },
    { id: 'true_false', label: 'True/False' },
    { id: 'matching', label: 'Matching' },
    { id: 'ordering', label: 'Ordering' },
    { id: 'numerical_input', label: 'Numerical Input' },
    { id: 'essay', label: 'Essay' },
]

export function RecalculateScoreDialog({ actionUrl, triggerText = "Recalculate Score", size = "default", variant = "outline" }: { actionUrl: string, triggerText?: string, size?: "default" | "sm" | "icon" | "lg", variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" }) {
    const [open, setOpen] = useState(false)
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])
    const [isAll, setIsAll] = useState(true)
    const [loading, setLoading] = useState(false)
    const uniqueId = useId()

    const handleRecalculate = () => {
        setLoading(true)

        // If "All" is selected or no specific types are checked (fallback to all), send 'all'
        // Otherwise send the array
        const payload = isAll || selectedTypes.length === 0 ? 'all' : selectedTypes

        router.post(actionUrl, {
            question_type: payload
        }, {
            onFinish: () => {
                setLoading(false)
                setOpen(false)
            }
        })
    }

    const toggleType = (typeId: string) => {
        setSelectedTypes(prev => {
            if (prev.includes(typeId)) {
                const newState = prev.filter(t => t !== typeId)
                if (newState.length === 0) setIsAll(true)
                return newState
            } else {
                setIsAll(false)
                return [...prev, typeId]
            }
        })
    }

    const toggleAll = (checked: boolean) => {
        setIsAll(checked)
        if (checked) {
            setSelectedTypes([])
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={variant} size={size}>{triggerText}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Recalculate Scores</DialogTitle>
                    <DialogDescription>
                        Select which question types to recalculate.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-4">
                        <Label className="font-semibold">Question Types</Label>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={`all-${uniqueId}`}
                                checked={isAll}
                                onCheckedChange={(c) => toggleAll(!!c)}
                            />
                            <Label htmlFor={`all-${uniqueId}`} className="cursor-pointer">All Types</Label>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pl-2">
                            {QUESTION_TYPES.map((type) => (
                                <div key={type.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${type.id}-${uniqueId}`}
                                        checked={selectedTypes.includes(type.id)}
                                        onCheckedChange={() => {
                                            if (isAll) setIsAll(false);
                                            toggleType(type.id);
                                        }}
                                        disabled={isAll}
                                    />
                                    <Label htmlFor={`${type.id}-${uniqueId}`} className={isAll ? "opacity-50" : ""}>{type.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleRecalculate} disabled={loading}>
                        {loading && <Spinner className="mr-2 h-4 w-4" />}
                        Recalculate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
