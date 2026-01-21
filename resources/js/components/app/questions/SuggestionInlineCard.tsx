import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, X, Pencil, Trash2, Clock, AlertCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import QuestionSuggestionController from '@/actions/App/Http/Controllers/Admin/QuestionSuggestionController';
import { cn } from "@/lib/utils";
import SuggestionForm from './SuggestionForm';
import { Option } from './option-editors/types'; // Make sure this import matches your structure


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
    data: {
        content?: string;
        options?: Option[];
        [key: string]: any;
    };
    question?: {
        id: string;
        question_type: string;
    };
}

interface SuggestionInlineCardProps {
    suggestion: Suggestion;
    isOwner?: boolean;
    currentUserId?: string | number;
}

export default function SuggestionInlineCard({ suggestion, isOwner = false, currentUserId }: SuggestionInlineCardProps) {
    const isPending = suggestion.state === 'pending';
    const isApproved = suggestion.state === 'approved';
    const isRejected = suggestion.state === 'rejected';

    const [isEditOpen, setIsEditOpen] = useState(false);
    // Default open if pending, closed if resolved (approved/rejected) to save space
    const [isExpanded, setIsExpanded] = useState(isPending);

    // Check if the current user is the creator of the suggestion
    const isCreator = currentUserId != null && (
        (suggestion.user_id && suggestion.user_id.toString() === currentUserId.toString()) ||
        (suggestion.user?.id && suggestion.user.id.toString() === currentUserId.toString())
    );

    const canEditOrDelete = isCreator && isPending;
    const canApproveReject = isOwner && isPending;

    // Use Inertia form for tracking processing state
    const [processing, setProcessing] = useState(false);

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
                preserveScroll: true,
                onSuccess: () => {
                    if (action === 'approve') {
                        window.location.reload();
                    }
                }
            });
        }
    };

    const handleSaveEdit = (formData: { description: string; content: string; options: Option[] }) => {
        router.put(QuestionSuggestionController.update(suggestion.id).url, {
            description: formData.description,
            content: formData.content,
            data: {
                content: formData.content,
                options: formData.options
            }
        }, {
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => setIsEditOpen(false),
            preserveScroll: true
        });
    };

    // Style configuration based on state
    const stateStyles = {
        pending: {
            card: "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/10",
            avatarBorder: "border-amber-200",
            avatarFallback: "bg-amber-100 text-amber-700",
            headerText: "text-amber-900 dark:text-amber-100",
            subtext: "text-amber-700 dark:text-amber-300",
            badge: "bg-amber-100 text-amber-800 border-amber-200",
            contentBg: "border-amber-100 dark:border-amber-900/50",
            titleIcon: "text-amber-600",
            footer: "bg-amber-100/50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
        },
        approved: {
            card: "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10",
            avatarBorder: "border-green-200",
            avatarFallback: "bg-green-100 text-green-700",
            headerText: "text-green-900 dark:text-green-100",
            subtext: "text-green-700 dark:text-green-300",
            badge: "bg-green-100 text-green-800 border-green-200",
            contentBg: "border-green-100 dark:border-green-900/50",
            titleIcon: "text-green-600",
            footer: "bg-green-100/50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        },
        rejected: {
            card: "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/10",
            avatarBorder: "border-red-200",
            avatarFallback: "bg-red-100 text-red-700",
            headerText: "text-red-900 dark:text-red-100",
            subtext: "text-red-700 dark:text-red-300",
            badge: "bg-red-100 text-red-800 border-red-200",
            contentBg: "border-red-100 dark:border-red-900/50",
            titleIcon: "text-red-600",
            footer: "bg-red-100/50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        }
    };

    const currentStyle = stateStyles[suggestion.state as keyof typeof stateStyles] || stateStyles.pending;
    const questionType = suggestion.question?.question_type || 'multiple_choice'; // Fallback

    return (
        <Card className={cn("flex flex-col transition-all duration-200", currentStyle.card, isExpanded ? "h-full" : "h-auto")}>
            <CardHeader
                className="p-4 pb-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-t-lg"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        <Avatar className={cn("h-8 w-8 border", currentStyle.avatarBorder)}>
                            <AvatarFallback className={cn("text-xs", currentStyle.avatarFallback)}>
                                {suggestion.user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className={cn("text-sm font-semibold", currentStyle.headerText)}>
                                {suggestion.user.name}
                            </div>
                            <div className={cn("text-xs flex items-center gap-1", currentStyle.subtext)}>
                                <Clock className="w-3 h-3" />
                                {new Date(suggestion.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {isPending && (
                        <Badge variant="outline" className={currentStyle.badge}>
                            Saran
                        </Badge>
                    )}
                    {isApproved && (
                        <Badge variant="outline" className={cn("gap-1 pr-3", currentStyle.badge)}>
                            <CheckCircle2 className="w-3 h-3" />
                            Diterima
                        </Badge>
                    )}
                    {isRejected && (
                        <Badge variant="outline" className={cn("gap-1 pr-3", currentStyle.badge)}>
                            <XCircle className="w-3 h-3" />
                            Ditolak
                        </Badge>
                    )}
                </div>
            </CardHeader>

            {isExpanded && (
                <>
                    <CardContent className="p-4 flex-1 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <div className={cn("bg-white dark:bg-slate-950 rounded-lg p-3 border text-sm shadow-sm", currentStyle.contentBg)}>
                            <div className={cn("flex items-start gap-2 mb-1 font-medium text-xs uppercase tracking-wider", currentStyle.titleIcon)}>
                                <AlertCircle className="w-3 h-3 mt-0.5" />
                                Alasan
                            </div>
                            <p className="text-muted-foreground">{suggestion.description}</p>
                        </div>

                        {suggestion.data?.content && (
                            <div className="space-y-4 border rounded-md p-3 bg-white/50 dark:bg-black/5">
                                <div>
                                    <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Usulan Konten Baru</div>
                                    <div className="bg-white dark:bg-slate-950 rounded-md border p-3 max-h-[200px] overflow-y-auto custom-scrollbar">
                                        <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: suggestion.data.content }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    {(canEditOrDelete || canApproveReject) && (
                        <CardFooter className={cn("p-3 flex justify-end gap-2 border-t mt-auto", currentStyle.footer)}>
                            <div className="flex gap-2 w-full">
                                {canEditOrDelete && (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
                                            onClick={(e) => { e.stopPropagation(); handleAction('delete'); }}
                                            title="Hapus Saran"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-muted-foreground hover:text-blue-500 hover:bg-blue-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
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
                                            onClick={(e) => { e.stopPropagation(); handleAction('reject'); }}
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Tolak
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 h-8"
                                            onClick={(e) => { e.stopPropagation(); handleAction('approve'); }}
                                        >
                                            <Check className="w-4 h-4 mr-1" />
                                            Terima
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardFooter>
                    )}
                </>
            )}

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Saran Perubahan</DialogTitle>
                        <DialogDescription>
                            Ubah detail saran sebelum menyetujui atau menolak.
                        </DialogDescription>
                    </DialogHeader>

                    <SuggestionForm
                        initialData={{
                            description: suggestion.description,
                            content: suggestion.data?.content || '',
                            options: suggestion.data?.options || []
                        }}
                        questionType={questionType}
                        onSubmit={handleSaveEdit}
                        onCancel={() => setIsEditOpen(false)}
                        isProcessing={processing}
                    />
                </DialogContent>
            </Dialog>
        </Card>
    );
}
