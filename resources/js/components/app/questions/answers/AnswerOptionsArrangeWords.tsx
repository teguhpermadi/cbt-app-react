import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Check } from 'lucide-react';

interface Props {
    options: any[];
    showKeyAnswer?: boolean;
}

export default function AnswerOptionsArrangeWords({ options, showKeyAnswer = true }: Props) {
    // Current options structure for ArrangeWords is a single option with content (sentence) 
    // and metadata (delimiter)
    const option = options.length > 0 ? options[0] : null;

    if (!option) return null;

    const sentence = option.content || '';
    const delimiter = option.metadata?.delimiter || ' ';
    const tokens = sentence.split(delimiter).filter((t: string) => t.length > 0);

    return (
        <div className="space-y-4">
            <div className={`p-4 rounded-lg bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800`}>
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-800 dark:text-emerald-400">
                        <Check className="w-4 h-4" />
                    </div>
                    <div className="space-y-3 w-full">
                        <div>
                            <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 block mb-1">
                                Kalimat Benar (Kunci Jawaban):
                            </span>
                            <p className="text-base font-medium text-emerald-900 dark:text-emerald-100">
                                {sentence} <span className="text-muted-foreground text-sm font-normal">(Delimiter: "{delimiter}")</span>
                            </p>
                        </div>

                        <div>
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block mb-2">
                                Token (Urutan Benar):
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {tokens.map((token: string, index: number) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:bg-black/20 dark:border-emerald-700 dark:text-emerald-300"
                                    >
                                        <span className="opacity-50 mr-1.5 text-xs text-emerald-500">#{index + 1}</span>
                                        {token}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
