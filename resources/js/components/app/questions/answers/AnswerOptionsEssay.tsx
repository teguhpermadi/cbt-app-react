import { AnswerOptionProps } from "../types";
import { Textarea } from "@/components/ui/textarea";

export default function AnswerOptionsEssay({ options, showKeyAnswer = true }: AnswerOptionProps) {
    // Essay might not have explicit options in DB for the key answer text if it's manual grading,
    // but sometimes it has a rubric or model answer in metadata.
    // Assuming the first option might contain rubric or model answer if available.

    const option = options[0];
    const rubric = option?.metadata?.rubric; // Example: assuming rubric is in metadata
    const modelAnswer = option?.content;      // Or assuming content is model answer

    return (
        <div className="space-y-4">
            <Textarea
                placeholder="Area jawaban peserta..."
                disabled
                className="min-h-[120px] resize-none bg-muted/20"
            />

            {showKeyAnswer && (option || rubric) && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">Panduan Penilaian / Rubrik</h4>

                    {modelAnswer && (
                        <div className="space-y-1">
                            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-500">Contoh Jawaban / Poin Utama:</div>
                            <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: modelAnswer }} />
                        </div>
                    )}

                    {rubric && (
                        <div className="space-y-1 mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-700">
                            <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Rubrik Penilaian:</div>
                            <pre className="text-xs whitespace-pre-wrap bg-white dark:bg-black/20 p-2 rounded border border-slate-100 dark:border-slate-800">
                                {JSON.stringify(rubric, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
