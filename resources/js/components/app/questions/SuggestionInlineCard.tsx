import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, X, Pencil, Trash2, User, Clock, AlertCircle } from "lucide-react";
import RichTextEditor from "@/components/ui/rich-text/RichTextEditor";
import QuestionSuggestionController from '@/actions/App/Http/Controllers/Admin/QuestionSuggestionController';

interface Suggestion {
    id: string;
    description: string;
    state: string;
    created_at: string;
    user_id: number | string;
    user: {
        id?: number | string;
        name: string;
        email: string;
    };
    data: any; // suggested changes
}

interface SuggestionInlineCardProps {
    suggestion: Suggestion;
    isOwner?: boolean;
    currentUserId?: string | number;
}

export default function SuggestionInlineCard({ suggestion, isOwner = false, currentUserId }: SuggestionInlineCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Check if the current user is the creator of the suggestion
    const isCreator = currentUserId != null && (
        (suggestion.user_id && suggestion.user_id.toString() === currentUserId.toString()) ||
        (suggestion.user?.id && suggestion.user.id.toString() === currentUserId.toString())
    );

    const canEditOrDelete = isCreator;
    const canApproveReject = isOwner;

    // Simple edit form for description and content (basic usage)
    // If you need full question editing capabilities, this would need to replicate the full QuestionForm
    const { data: editData, setData: setEditData, put, processing, reset } = useForm({
        description: suggestion.description,
        content: suggestion.data?.content || '',
    });

    const handleAction = (action: 'approve' | 'reject' | 'delete') => {
        const labels = {
            approve: 'menyetujui',
            reject: 'menolak',
            delete: 'menghapus'
        };

        if (!confirm(`Apakah anda yakin ingin ${labels[action]} saran ini?`)) return;

        if (action === 'delete') {
            router.delete(QuestionSuggestionController.destroy(suggestion.id).url, {
                preserveScroll: true
            });
        } else {
            // For approve/reject only
            const url = action === 'approve'
                ? QuestionSuggestionController.approve(suggestion.id).url
                : QuestionSuggestionController.reject(suggestion.id).url;

            router.post(url, {}, {
                preserveScroll: true
            });
        }
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(QuestionSuggestionController.update(suggestion.id).url, {
            onSuccess: () => setIsEditOpen(false),
            preserveScroll: true
        });
    };

    return (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/10 h-full flex flex-col">
            <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border border-amber-200">
                            <AvatarFallback className="bg-amber-100 text-amber-700 text-xs">
                                {suggestion.user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                                {suggestion.user.name}
                            </div>
                            <div className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(suggestion.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                        Saran
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-4 flex-1 space-y-4">
                <div className="bg-white dark:bg-slate-950 rounded-lg p-3 border border-amber-100 dark:border-amber-900/50 text-sm shadow-sm">
                    <div className="flex items-start gap-2 mb-1 text-amber-600 font-medium text-xs uppercase tracking-wider">
                        <AlertCircle className="w-3 h-3 mt-0.5" />
                        Alasan
                    </div>
                    <p className="text-muted-foreground">{suggestion.description}</p>
                </div>

                <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase">Usulan Konten Baru</div>
                    <div className="bg-white dark:bg-slate-950 rounded-md border p-3 max-h-[200px] overflow-y-auto custom-scrollbar">
                        <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: suggestion.data?.content || '<span class="text-muted-foreground text-xs italic">Tidak ada konten usulan</span>' }} />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-3 bg-amber-100/50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800 flex justify-end gap-2">
                <div className="flex gap-2 w-full">
                    {canEditOrDelete && (
                        <>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
                                onClick={() => handleAction('delete')}
                                title="Hapus Saran"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-muted-foreground hover:text-blue-500 hover:bg-blue-50"
                                onClick={() => {
                                    setEditData({ description: suggestion.description, content: suggestion.data?.content || '' });
                                    setIsEditOpen(true)
                                }}
                                title="Edit Saran"
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </>
                    )}

                    <div className="flex-1" />

                    {canApproveReject && (
                        <>
                            <Button
                                size="sm"
                                variant="destructive"
                                className="h-8"
                                onClick={() => handleAction('reject')}
                            >
                                <X className="w-4 h-4 mr-1" />
                                Tolak
                            </Button>
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 h-8"
                                onClick={() => handleAction('approve')}
                            >
                                <Check className="w-4 h-4 mr-1" />
                                Terima
                            </Button>
                        </>
                    )}
                </div>
            </CardFooter>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-xl">
                    <form onSubmit={handleSaveEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Saran Perubahan</DialogTitle>
                            <DialogDescription>
                                Ubah detail saran sebelum menyetujui atau menolak.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Alasan</Label>
                                <Textarea
                                    id="edit-description"
                                    value={editData.description}
                                    onChange={(e) => setEditData('description', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Usulan Konten</Label>
                                <RichTextEditor
                                    value={editData.content}
                                    onChange={(model) => setEditData('content', model)}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Simpan Perubahan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
