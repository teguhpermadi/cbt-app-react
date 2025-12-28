import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Clock, Timer, Zap } from 'lucide-react';

interface TimerType {
    value: string;
    label: string;
    description: string;
}

interface TimerTypeSelectorProps {
    value: string;
    onValueChange: (value: string) => void;
    timerTypes?: TimerType[];
    className?: string;
    label?: string; // Optional label override
    error?: string;
}

const defaultTimerTypes: TimerType[] = [
    {
        value: 'strict',
        label: 'Ketat',
        description: 'Timer berjalan terus meskipun siswa keluar dari ujian',
    },
    {
        value: 'flexible',
        label: 'Longgar',
        description: 'Timer berhenti saat siswa keluar dari ujian',
    },
];

export function TimerTypeSelector({
    value,
    onValueChange,
    timerTypes,
    className,
    label,
    error,
}: TimerTypeSelectorProps) {
    // Gunakan timerTypes jika ada dan valid, jika tidak gunakan default
    const types = (timerTypes && timerTypes.length > 0) ? timerTypes : defaultTimerTypes;

    const strictType = types.find(t => t.value === 'strict');
    const flexibleType = types.find(t => t.value === 'flexible');

    const isStrict = value === 'strict';
    const currentDescription = isStrict ? strictType?.description : flexibleType?.description;

    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex flex-row items-center justify-between rounded-xl border p-4 shadow-sm bg-card hover:bg-accent/20 transition-colors">
                <div className="space-y-0.5 flex-1 mr-4">
                    <div className="flex items-center gap-2">
                        {isStrict ? (
                            <Zap className="h-4 w-4 text-orange-500" />
                        ) : (
                            <Clock className="h-4 w-4 text-blue-500" />
                        )}
                        <Label htmlFor="timer-switch" className="text-base font-semibold cursor-pointer">
                            {label || 'Mode Timer Ketat'}
                        </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {currentDescription || 'Atur perilaku timer saat siswa keluar ujian'}
                    </p>
                </div>
                <Switch
                    id="timer-switch"
                    checked={isStrict}
                    onCheckedChange={(checked) => onValueChange(checked ? 'strict' : 'flexible')}
                />
            </div>
            {error && <p className="text-sm text-destructive mt-1 px-1">{error}</p>}
        </div>
    );
}


