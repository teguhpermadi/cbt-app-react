
import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Eye, MessageSquare, ArrowRight } from 'lucide-react';
import QuestionController from '@/wayfinder/actions/App/Http/Controllers/Admin/QuestionController';
import QuestionBankController from '@/actions/App/Http/Controllers/Admin/QuestionBankController';

interface QuestionSuggestion {
    id: string;
    description: string;
    state: string;
    created_at: string;
    user?: {
        name: string;
    };
    question: {
        id: string;
        content: string;
        question_bank?: {
            id: string;
            name: string;
        };
        author?: {
            name: string;
        };
    };
}

interface Props extends PageProps {
    receivedSuggestions: QuestionSuggestion[];
    sentSuggestions: QuestionSuggestion[];
}

export default function QuestionSuggestionsIndex({ auth, receivedSuggestions, sentSuggestions }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Menunggu</Badge>;
            case 'approved':
                return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Diterima</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Ditolak</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Saran Soal', href: '/admin/question-suggestions' }]}>
            <Head title="Saran Soal" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Saran Soal</h1>
                        <p className="text-muted-foreground font-medium">
                            Kelola saran perbaikan soal dari pengguna lain.
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="received" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="received">Saran Masuk ({receivedSuggestions.length})</TabsTrigger>
                        <TabsTrigger value="sent">Saran Terkirim ({sentSuggestions.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="received" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Saran Masuk</CardTitle>
                                <CardDescription>
                                    Daftar saran yang diberikan oleh pengguna lain untuk soal Anda.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {receivedSuggestions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg">
                                        <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
                                        <p className="text-lg font-medium">Belum ada saran masuk</p>
                                        <p className="text-muted-foreground max-w-sm mt-1">
                                            Belum ada pengguna lain yang memberikan saran untuk soal-soal Anda.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[300px]">Soal</TableHead>
                                                    <TableHead>Pemberi Saran</TableHead>
                                                    <TableHead>Saran</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Waktu</TableHead>
                                                    <TableHead className="text-right">Aksi</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {receivedSuggestions.map((suggestion) => (
                                                    <TableRow key={suggestion.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: suggestion.question.content }} />
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                Bank: {suggestion.question.question_bank?.name}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                                                                    {suggestion.user?.name.charAt(0)}
                                                                </div>
                                                                <span>{suggestion.user?.name}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="max-w-[200px]">
                                                            <p className="truncate" title={suggestion.description}>{suggestion.description}</p>
                                                        </TableCell>
                                                        <TableCell>{getStatusBadge(suggestion.state)}</TableCell>
                                                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                                                            {formatDate(suggestion.created_at)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Link href={QuestionController.edit(suggestion.question.id)}>
                                                                <Button size="sm" variant="outline">
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Review
                                                                </Button>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="sent" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Saran Terkirim</CardTitle>
                                <CardDescription>
                                    Daftar saran yang Anda kirimkan untuk soal milik pengguna lain.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sentSuggestions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg">
                                        <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
                                        <p className="text-lg font-medium">Belum ada saran terkirim</p>
                                        <p className="text-muted-foreground max-w-sm mt-1">
                                            Anda belum memberikan saran untuk soal apapun.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[300px]">Soal</TableHead>
                                                    <TableHead>Pemilik Soal</TableHead>
                                                    <TableHead>Saran Anda</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Waktu</TableHead>
                                                    <TableHead className="text-right">Aksi</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {sentSuggestions.map((suggestion) => (
                                                    <TableRow key={suggestion.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: suggestion.question.content }} />
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                Bank: {suggestion.question.question_bank?.title}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <div className="bg-muted text-muted-foreground rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                                                                    {suggestion.question.author?.name.charAt(0) ?? '?'}
                                                                </div>
                                                                <span>{suggestion.question.author?.name}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="max-w-[200px]">
                                                            <p className="truncate" title={suggestion.description}>{suggestion.description}</p>
                                                        </TableCell>
                                                        <TableCell>{getStatusBadge(suggestion.state)}</TableCell>
                                                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                                                            {formatDate(suggestion.created_at)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Link href={QuestionBankController.show(suggestion.question.question_bank?.id)}>
                                                                <Button size="sm" variant="ghost">
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Lihat Bank
                                                                </Button>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppSidebarLayout>
    );
}
