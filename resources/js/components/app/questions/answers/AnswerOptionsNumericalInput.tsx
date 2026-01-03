import { AnswerOptionProps } from "../types";
import { MathField } from "@/components/ui/math-field";
import RichTextEditor from "@/components/ui/rich-text/RichTextEditor";

export default function AnswerOptionsNumericalInput({ options, showKeyAnswer = true }: AnswerOptionProps) {
    // Usually only one option record for numerical, storing answer in metadata
    const option = options[0];

    if (!option) return <div className="text-muted-foreground">Konfigurasi jawaban tidak valid.</div>;

    const correctAnswer = option.metadata?.correct_answer ?? option.content;

    return (
        <div className="space-y-4">
            {/* <div className="flex items-center gap-2">
                <MathField
                    value=""
                    placeholder="Area jawaban siswa..."
                    readOnly
                    className="flex-1 min-h-[3rem]"
                />
            </div> */}

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
                    <div className="space-y-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">Rumus / Jawaban</span>
                            <div className="border rounded bg-white dark:bg-slate-950 p-2">
                                <RichTextEditor
                                    value={correctAnswer}
                                    readOnly={true}
                                    className="border-none bg-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
