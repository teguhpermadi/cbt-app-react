import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Trash2, Plus, Search, X } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import GradeStudentController from '@/actions/App/Http/Controllers/Admin/GradeStudentController';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';

interface Grade {
    id: string;
    name: string;
    level: string | null;
}

interface User {
    id: string;
    name: string;
    email: string;
}

interface ManageStudentsModalProps {
    grade: Grade | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStudentAdded?: () => void;
}

export default function ManageStudentsModal({ grade, open, onOpenChange, onStudentAdded }: ManageStudentsModalProps) {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<User[]>([]);
    const [availableStudents, setAvailableStudents] = useState<User[]>([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        if (!grade) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(GradeStudentController.index(grade.id).url);
            setStudents(response.data.students);
            setAvailableStudents(response.data.available_students);
        } catch (err) {
            console.error(err);
            setError('Failed to load students.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && grade) {
            fetchData();
            setSelectedStudentIds([]);
            setSearchQuery('');
        }
    }, [open, grade]);

    const handleAddStudents = async () => {
        if (!grade || selectedStudentIds.length === 0) return;
        setLoading(true);
        setError(null);
        try {
            // Add students one by one (or batch if API supports it)
            // For now, we'll do sequential adds
            for (const studentId of selectedStudentIds) {
                await axios.post(GradeStudentController.store(grade.id).url, {
                    user_id: studentId,
                });
            }
            await fetchData();
            setSelectedStudentIds([]);
            onStudentAdded?.(); // Trigger reload di parent
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || err.response?.data?.errors?.user_id?.[0] || 'Failed to assign students.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveStudent = async (studentId: string) => {
        if (!grade || !confirm('Are you sure you want to remove this student?')) return;
        setLoading(true);
        setError(null);
        try {
            await axios.delete(GradeStudentController.destroy({ grade: grade.id, student: studentId }).url);
            await fetchData();
            onStudentAdded?.(); // Trigger reload di parent
        } catch (err: any) {
            console.error(err);
            setError('Failed to remove student.');
        } finally {
            setLoading(false);
        }
    };

    const toggleStudentSelection = (studentId: string) => {
        setSelectedStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const selectAllFiltered = () => {
        setSelectedStudentIds(filteredAvailableStudents.map(s => s.id));
    };

    const deselectAll = () => {
        setSelectedStudentIds([]);
    };

    // Filter available students based on search query
    const filteredAvailableStudents = useMemo(() => {
        if (!searchQuery) return availableStudents;
        const lowerQuery = searchQuery.toLowerCase();
        return availableStudents.filter(s =>
            s.name.toLowerCase().includes(lowerQuery) ||
            s.email.toLowerCase().includes(lowerQuery)
        );
    }, [availableStudents, searchQuery]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col rounded-3xl border-none shadow-2xl p-0 gap-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Manage Students</DialogTitle>
                        <DialogDescription>
                            Assign students to <span className="font-semibold text-primary">{grade?.name}</span>.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    {/* Add Student Section */}
                    <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Plus className="size-3" /> Add Students
                            </Label>
                            {selectedStudentIds.length > 0 && (
                                <Badge variant="secondary" className="rounded-full">
                                    {selectedStudentIds.length} selected
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search available students..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 rounded-xl border-slate-200 bg-white dark:bg-slate-950"
                                />
                            </div>

                            {/* Selection Controls */}
                            {filteredAvailableStudents.length > 0 && (
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={selectAllFiltered}
                                        disabled={loading}
                                        className="text-xs rounded-lg"
                                    >
                                        Select All {searchQuery && `(${filteredAvailableStudents.length})`}
                                    </Button>
                                    {selectedStudentIds.length > 0 && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={deselectAll}
                                            disabled={loading}
                                            className="text-xs rounded-lg"
                                        >
                                            <X className="h-3 w-3 mr-1" />
                                            Clear
                                        </Button>
                                    )}
                                </div>
                            )}

                            {/* Available Students List with Checkboxes */}
                            <div className="max-h-[200px] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                                {filteredAvailableStudents.length > 0 ? (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredAvailableStudents.map((student) => (
                                            <label
                                                key={student.id}
                                                className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors bg-white dark:bg-slate-950"
                                            >
                                                <Checkbox
                                                    checked={selectedStudentIds.includes(student.id)}
                                                    onCheckedChange={() => toggleStudentSelection(student.id)}
                                                    disabled={loading}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                        {student.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground truncate">
                                                        {student.email}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-sm text-center text-muted-foreground bg-white dark:bg-slate-950">
                                        {searchQuery ? "No matching students found" : "No available students"}
                                    </div>
                                )}
                            </div>

                            {/* Add Button */}
                            <Button
                                onClick={handleAddStudents}
                                disabled={loading || selectedStudentIds.length === 0}
                                className="rounded-xl font-bold shadow-md w-full"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add {selectedStudentIds.length > 0 ? `${selectedStudentIds.length} Student${selectedStudentIds.length > 1 ? 's' : ''}` : 'Students'}
                                    </>
                                )}
                            </Button>
                        </div>
                        {error && <InputError message={error} />}
                    </div>

                    {/* Student List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Assigned Students ({students.length})
                            </Label>
                        </div>

                        {loading && students.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-muted-foreground" />
                            </div>
                        ) : students.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                                {students.map((student) => (
                                    <div key={student.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors bg-white dark:bg-slate-950">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {student.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{student.name}</span>
                                                <span className="text-xs text-muted-foreground">{student.email}</span>
                                            </div>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            onClick={() => handleRemoveStudent(student.id)}
                                            disabled={loading}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-muted-foreground text-sm">No students assigned to this grade yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
