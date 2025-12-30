import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface FinishedProps {
    exam: any;
}

export default function Finished({ exam }: FinishedProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Head title={`Ujian Selesai - ${exam.title}`} />

            <Card className="w-full max-w-md text-center">
                <CardHeader className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl">Ujian Selesai</CardTitle>
                        <CardDescription className="text-base">
                            Terima kasih sudah mengikuti ujian <strong>{exam.title}</strong>.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                        Jawaban Anda telah berhasil disimpan. Silahkan kembali ke dashboard untuk melihat ujian lainnya.
                    </p>
                    <Link href="/student/dashboard">
                        <Button className="w-full">
                            Kembali ke Dashboard
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
