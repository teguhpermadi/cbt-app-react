import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

// Wayground Imports
import { index } from '@/routes/admin/question-banks';
import QuestionBankController from '@/actions/App/Http/Controllers/Admin/QuestionBankController';

export default function Create({ subjects }) {
    const { data, setData, post, processing, errors } = useForm({
        name: 'Untitled Question Bank',
        subject_id: '',
        description: '',
        is_public: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Using Wayground Action
        post(QuestionBankController.store.url());
    };

    return (
        <AppShell variant="header">
            <Head title="Buat Bank Soal" />

            {/* Custom Top Bar */}
            <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={index().url}>
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>

                <div className="flex-1">
                    <Input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="h-10 text-lg font-semibold border-transparent focus-visible:ring-0 px-0 hover:border-input focus-visible:border-input focus-visible:px-3 transition-all max-w-md"
                        placeholder="Nama Bank Soal"
                    />
                    {errors.name && <div className="text-sm text-red-500 mt-1">{errors.name}</div>}
                </div>

                <Button onClick={submit} disabled={processing}>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6 bg-muted/10">
                <div className="max-w-3xl mx-auto space-y-6">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject_id">Mata Pelajaran</Label>
                                <Select
                                    value={data.subject_id}
                                    onValueChange={(value) => setData('subject_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Mata Pelajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.id}>
                                                {subject.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.subject_id && (
                                    <div className="text-sm text-red-500">{errors.subject_id}</div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Deskripsi singkat bank soal..."
                                />
                                {errors.description && (
                                    <div className="text-sm text-red-500">{errors.description}</div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_public"
                                    checked={data.is_public}
                                    onCheckedChange={(checked) => setData('is_public', checked)}
                                />
                                <Label htmlFor="is_public">Publik (Bisa diakses guru lain)</Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
