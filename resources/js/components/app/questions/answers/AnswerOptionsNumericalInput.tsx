import { AnswerOptionProps } from "../types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AnswerOptionsNumericalInput({ options, showKeyAnswer = true }: AnswerOptionProps) {
    // Usually only one option record for numerical, storing answer in metadata
    const option = options[0];

    if (!option) return <div className="text-muted-foreground">Konfigurasi jawaban tidak valid.</div>;

    const correctAnswer = option.metadata?.correct_answer ?? option.content;
    const tolerance = option.metadata?.tolerance ?? 0;
    const unit = option.metadata?.unit;

    return (
        <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    placeholder="Masukkan jawaban angka..."
                    disabled
                    className="flex-1"
                />
                {unit && (
                    <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-2 rounded-md">
                        {unit}
                    </span>
                )}
            </div>

            {/* Context/Explanation Image */}
            {(option.media_url || option.media_path) && (
                <div className="rounded-lg overflow-hidden border border-border max-w-xs">
                    <img
                        src={option.media_url || option.media_path || ''}
                        alt="Context"
                        className="max-h-[100px] max-w-full object-cover"
                    />
                </div>
            )}

            {showKeyAnswer && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800 space-y-2">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Kunci Jawaban</h4>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Jawaban Tepat</span>
                            <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                                {correctAnswer} {unit}
                            </span>
                        </div>
                        {Number(tolerance) > 0 && (
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Toleransi</span>
                                <span className="font-mono text-muted-foreground">
                                    ± {tolerance}
                                </span>
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Rentang Valid</span>
                            <span className="font-mono text-slate-700 dark:text-slate-300">
                                {Number(correctAnswer) - Number(tolerance)} s/d {Number(correctAnswer) + Number(tolerance)} {unit}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
