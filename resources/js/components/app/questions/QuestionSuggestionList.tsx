import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Clock, User, ArrowRight } from 'lucide-react';
import { router } from '@inertiajs/react';
import RichTextEditor from '@/components/ui/rich-text/RichTextEditor';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Suggestion {
    id: string;
    question_id: string;
    user_id: string;
    description: string;
    state: string;
    created_at: string;
    user: {
        name: string;
        email: string;
    };
    question: {
        content: string;
    };
    data: any; // Stores the suggested changes
}

interface Props {
    suggestions: Suggestion[];
}

export default function QuestionSuggestionList({ suggestions }: Props) {
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);

    const handleAction = (suggestion: Suggestion, action: 'approve' | 'reject') => {
        if (!confirm(`Apakah anda yakin ingin me-${action === 'approve' ? 'nyetujui' : 'nolak'} saran ini?`)) return;

        router.post(route(`admin.questions.suggestions.${action}`, suggestion.id), {}, {
            preserveScroll: true,
            onSuccess: () => setSelectedSuggestion(null)
        });
    };

    const getStatusBadge = (state: string) => {
        switch (state) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Disetujui</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Ditolak</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Menunggu</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            {suggestions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                    Belum ada saran masuk.
                </div>
            ) : (
                suggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x">
                                {/* Left: Meta & User */}
                                <div className="p-4 md:w-1/4 bg-muted/5 space-y-3 flex flex-col">
                                    <div className="flex items-center justify-between">
                                        {getStatusBadge(suggestion.state)}
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(suggestion.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {suggestion.user.name.charAt(0)}
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-medium">{suggestion.user.name}</div>
                                            <div className="text-xs text-muted-foreground">{suggestion.user.email}</div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 p-3 rounded text-xs text-amber-800 border border-amber-100 mt-auto">
                                        <span className="font-semibold block mb-1">Alasan:</span>
                                        {suggestion.description}
                                    </div>
                                </div>

                                {/* Right: Content Preview */}
                                <div className="p-4 md:w-3/4 flex flex-col">
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Original Question</h4>
                                            <div className="text-sm line-clamp-2 text-muted-foreground" dangerouslySetInnerHTML={{ __html: suggestion.question.content }} />
                                        </div>

                                        <div className="flex items-center justify-center py-2 text-muted-foreground/30">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold uppercase text-primary mb-2">Suggested Change</h4>
                                            <div className="text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: suggestion.data.content }} />
                                        </div>
                                    </div>

                                    {suggestion.state === 'pending' && (
                                        <div className="mt-4 flex justify-end gap-2 pt-4 border-t">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-primary"
                                                onClick={() => setSelectedSuggestion(suggestion)}
                                            >
                                                Lihat Detail
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleAction(suggestion, 'reject')}
                                            >
                                                Tolak
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => handleAction(suggestion, 'approve')}
                                            >
                                                Setuju & Terapkan
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}

            {/* Detail Dialog */}
            <Dialog open={!!selectedSuggestion} onOpenChange={(open) => !open && setSelectedSuggestion(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detail Saran Perubahan</DialogTitle>
                        <DialogDescription>
                            Tinjau detail perubahan yang disarankan oleh {selectedSuggestion?.user.name}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSuggestion && (
                        <div className="grid grid-cols-2 gap-6 py-4">
                            {/* Original */}
                            <div className="space-y-3 p-4 border rounded-lg bg-muted/10 opacity-70">
                                <h3 className="font-bold text-sm text-muted-foreground uppercase text-center border-b pb-2">Original</h3>
                                <div>
                                    <span className="text-xs font-semibold">Content:</span>
                                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedSuggestion.question.content }} />
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>Difficulty: <Badge variant="outline">{selectedSuggestion.question.content /* Would need full question data here really, assuming generic match for layout */}</Badge></div>
                                    {/* Simplified view since we don't have full original object easily without passing it all or refetching. 
                                         Ideally we compare field by field. For MVP, showing content is key. */}
                                </div>
                            </div>

                            {/* Suggested */}
                            <div className="space-y-3 p-4 border rounded-lg border-green-200 bg-green-50/30">
                                <h3 className="font-bold text-sm text-green-700 uppercase text-center border-b pb-2 border-green-200">Usulan Baru</h3>
                                <div>
                                    <span className="text-xs font-semibold">Content:</span>
                                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedSuggestion.data.content }} />
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>Type: {selectedSuggestion.data.question_type}</div>
                                    <div>Difficulty: {selectedSuggestion.data.difficulty_level}</div>
                                    <div>Timer: {selectedSuggestion.data.timer}s</div>
                                    <div>Score: {selectedSuggestion.data.score_value}</div>
                                </div>
                                <div className="mt-2">
                                    <span className="text-xs font-semibold">Hint:</span>
                                    <div className="text-xs italic" dangerouslySetInnerHTML={{ __html: selectedSuggestion.data.hint || '-' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedSuggestion(null)}>Tutup</Button>
                        {selectedSuggestion && selectedSuggestion.state === 'pending' && (
                            <>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        handleAction(selectedSuggestion, 'reject');
                                        setSelectedSuggestion(null);
                                    }}
                                >
                                    Tolak
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                        handleAction(selectedSuggestion, 'approve');
                                        setSelectedSuggestion(null);
                                    }}
                                >
                                    Setuju & Terapkan
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
