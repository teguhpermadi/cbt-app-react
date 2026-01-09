import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    options: any;
    onChange: (options: any) => void;
}

export default function OptionEditorArrangeWords({ options, onChange }: Props) {
    // There should be only one "option" for ArrangeWords which holds the sentence
    const currentOption = Array.isArray(options) && options.length > 0 ? options[0] : null;

    const [sentence, setSentence] = useState(currentOption?.content || '');
    const [delimiter, setDelimiter] = useState(currentOption?.metadata?.delimiter || ' ');
    const [tokens, setTokens] = useState<string[]>([]);

    useEffect(() => {
        // Split sentence by delimiter to show preview
        if (sentence) {
            setTokens(sentence.split(delimiter).filter((t: string) => t.length > 0));
        } else {
            setTokens([]);
        }
    }, [sentence, delimiter]);

    const handleUpdate = (newSentence: string, newDelimiter: string) => {
        setSentence(newSentence);
        setDelimiter(newDelimiter);

        // Update parent with the single option structure
        onChange([{
            option_key: 'SENTENCE',
            content: newSentence,
            is_correct: true,
            order: 0,
            metadata: {
                delimiter: newDelimiter
            }
        }]);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Kalimat Lengkap</Label>
                        <Textarea
                            placeholder="Contoh: Saya pergi ke pasar membeli sayur"
                            value={sentence}
                            onChange={(e) => handleUpdate(e.target.value, delimiter)}
                            rows={3}
                        />
                        <p className="text-sm text-muted-foreground">
                            Masukkan kalimat lengkap yang benar. Sistem akan mengacak urutan kata secara otomatis.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Pemisah Kata (Delimiter)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                className="w-20 font-mono text-center"
                                value={delimiter}
                                onChange={(e) => handleUpdate(sentence, e.target.value)}
                                maxLength={5}
                            />
                            <span className="text-sm text-muted-foreground">
                                Karakter yang digunakan untuk memisahkan kata (Default: spasi).
                            </span>
                        </div>
                    </div>

                    {tokens.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                            <Label>Preview Tokenisasi ({tokens.length} kata)</Label>
                            <div className="flex flex-wrap gap-2">
                                {tokens.map((token, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm border"
                                    >
                                        {token}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
