import { cn } from "@/lib/utils";
import { ArrowDown, GripVertical } from "lucide-react";
import { AnswerOptionProps } from "../types";

export default function AnswerOptionsOrdering({ options, showKeyAnswer = true }: AnswerOptionProps) {
    // If showKeyAnswer is true, we sort by correct position to show the target state
    // If false, we show the shuffled/current order (db 'order' usually)

    // Create a copy to sort
    const displayOptions = [...options];

    if (showKeyAnswer) {
        displayOptions.sort((a, b) => {
            const posA = a.metadata?.correct_position ?? 0;
            const posB = b.metadata?.correct_position ?? 0;
            return posA - posB;
        });
    } else {
        displayOptions.sort((a, b) => a.order - b.order);
    }

    return (
        <div className="space-y-2">
            {displayOptions.map((option, index) => (
                <div key={option.id} className="relative group">
                    {/* Visual Connector Line */}
                    {index < displayOptions.length - 1 && (
                        <div className="absolute left-6 top-full h-2 w-0.5 bg-muted/50 -ml-px z-0" />
                    )}

                    <div className={cn(
                        "relative z-10 flex items-center gap-3 p-3 rounded-xl border bg-card transition-all",
                        showKeyAnswer ? "border-emerald-100 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-950/10" : "border-border"
                    )}>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm",
                            showKeyAnswer ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" : "bg-muted text-muted-foreground"
                        )}>
                            {index + 1}
                        </div>

                        <div className="bg-muted/30 p-1.5 rounded-md text-muted-foreground cursor-grab active:cursor-grabbing">
                            <GripVertical className="w-4 h-4" />
                        </div>

                        <div className="flex-1">
                            <div className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: option.content }} />
                            {(option.media_url || option.media_path) && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-border max-w-xs">
                                    <img
                                        src={option.media_url || option.media_path || ''}
                                        alt="Visual"
                                        className="max-h-[100px] max-w-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {!showKeyAnswer && (
                <div className="text-center text-xs text-muted-foreground pt-2 italic">
                    Urutkan item di atas
                </div>
            )}
            {showKeyAnswer && (
                <div className="text-center text-xs text-emerald-600 dark:text-emerald-400 pt-2 font-medium">
                    Susunan Yang Benar
                </div>
            )}
        </div>
    );
}
