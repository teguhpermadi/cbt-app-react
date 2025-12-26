import { cn } from "@/lib/utils";
import { ArrowRightLeft } from "lucide-react";
import { AnswerOptionProps } from "../types";

export default function AnswerOptionsMatching({ options, showKeyAnswer = true }: AnswerOptionProps) {
    const leftOptions = options.filter(o => o.option_key.startsWith('L') || o.metadata?.side === 'left');
    const rightOptions = options.filter(o => o.option_key.startsWith('R') || o.metadata?.side === 'right');

    const getPairColor = (pairId: any) => {
        if (!showKeyAnswer) return "border-border bg-card";

        // Generate a deterministic color class based on pairId (simple rotation)
        const colors = [
            "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30",
            "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
            "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30",
            "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30",
            "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30",
            "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30",
        ];
        // Ensure pairId is a number
        const id = typeof pairId === 'number' ? pairId : parseInt(pairId) || 0;
        return colors[(id - 1) % colors.length];
    };

    const renderCard = (option: any, side: 'left' | 'right') => {
        const pairId = option.metadata?.pair_id;
        const colorClass = getPairColor(pairId);

        return (
            <div
                key={option.id}
                className={cn(
                    "p-3 rounded-lg border-2 text-sm flex items-center min-h-[50px] transition-all",
                    colorClass
                )}
            >
                {side === 'right' && showKeyAnswer && (
                    <span className="mr-2 text-xs font-bold opacity-50 bg-white/50 dark:bg-black/20 px-1 rounded">
                        {option.metadata?.pair_id}
                    </span>
                )}
                <div dangerouslySetInnerHTML={{ __html: option.content }} />

                {/* Media Preview */}
                {(option.media_url || option.media_path) && (
                    <div className="mt-2 rounded overflow-hidden border border-border h-12 w-auto bg-white/50 inline-block">
                        <img
                            src={option.media_url || option.media_path || ''}
                            alt="Visual"
                            className="h-full w-auto object-contain"
                        />
                    </div>
                )}
                {side === 'left' && showKeyAnswer && (
                    <span className="ml-auto text-xs font-bold opacity-50 bg-white/50 dark:bg-black/20 px-1 rounded">
                        {option.metadata?.pair_id}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-stretch bg-muted/20 p-4 rounded-xl">
            <div className="flex-1 space-y-3">
                <div className="text-xs font-semibold uppercase text-center text-muted-foreground pb-2 border-b">Premis (Kiri)</div>
                {leftOptions.map(option => renderCard(option, 'left'))}
            </div>

            <div className="hidden md:flex flex-col justify-center items-center text-muted-foreground opacity-20">
                <ArrowRightLeft className="w-8 h-8" />
            </div>

            <div className="flex-1 space-y-3">
                <div className="text-xs font-semibold uppercase text-center text-muted-foreground pb-2 border-b">Respon (Kanan)</div>
                {/* For display purpose, if we show key answer, we might want to sort right options to match left options visually, 
                     OR keep them scrambled but colored. Let's keep them originally ordered but colored. */}
                {rightOptions.map(option => renderCard(option, 'right'))}
            </div>
        </div>
    );
}
