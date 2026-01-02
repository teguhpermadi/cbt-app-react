import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, HelpCircle, Clock, Calendar, AlertCircle } from 'lucide-react';
import { format, differenceInMinutes, differenceInSeconds } from 'date-fns';
import PreviewStudentAnswerMultipleChoice from "@/components/app/questions/results/PreviewStudentAnswerMultipleChoice";
import PreviewStudentAnswerMultipleSelection from "@/components/app/questions/results/PreviewStudentAnswerMultipleSelection";

interface ExamSessionDetailProps {
    session: any;
}

export default function ExamSessionDetail({ session }: ExamSessionDetailProps) {
    const details = session.exam_result_details || [];
    const correctCount = details.filter((d: any) => d.is_correct === true).length;
    const incorrectCount = details.filter((d: any) => d.is_correct === false).length;
    // Assuming uncorrected/null is also a state, usually pending or partial.

    // Calculate duration
    const startTime = session.start_time ? new Date(session.start_time) : null;
    const finishTime = session.finish_time ? new Date(session.finish_time) : null;

    let durationString = '-';
    if (startTime && finishTime) {
        const diffInMinutes = differenceInMinutes(finishTime, startTime);
        const diffInSecondsRest = differenceInSeconds(finishTime, startTime) % 60;
        durationString = `${diffInMinutes}m ${diffInSecondsRest}s`;
    } else if (session.duration_taken) {
        durationString = `${session.duration_taken}m`;
    } else if (startTime && !session.is_finished) {
        // Show elapsed time for ongoing sessions
        const now = new Date();
        const diffInMinutes = differenceInMinutes(now, startTime);
        durationString = `${diffInMinutes}m (Ongoing)`;
    } else if (!session.is_finished) {
        durationString = 'Ongoing';
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Final Grade</CardTitle>
                        <Badge variant={session.exam_result?.is_passed ? "default" : "destructive"}>
                            {session.exam_result?.is_passed ? "PASSED" : "FAILED"}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{session.exam_result?.score_percent != null ? Math.round(session.exam_result.score_percent) : 0}</div>
                        <p className="text-xs text-muted-foreground">Total Points: {session.exam_result?.total_score != null ? Math.round(session.exam_result.total_score) : 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-green-600">{correctCount}</span>
                                <span className="text-xs text-muted-foreground">Correct</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-red-600">{incorrectCount}</span>
                                <span className="text-xs text-muted-foreground">Incorrect</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Time Taken</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{durationString}</div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Execution Date</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">
                            {startTime ? format(startTime, 'MMM d, yyyy') : '-'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {startTime ? format(startTime, 'HH:mm') : '-'} - {finishTime ? format(finishTime, 'HH:mm') : 'Ongoing'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-4">
                {details.map((detail: any, index: number) => (
                    <Card key={detail.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                                <div className="flex items-center gap-2">
                                    {detail.is_correct === true && <Badge className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3" /> Correct</Badge>}
                                    {detail.is_correct === false && <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Incorrect</Badge>}
                                    {detail.is_correct === null && <Badge variant="outline"><HelpCircle className="mr-1 h-3 w-3" /> Pending</Badge>}
                                    <Badge variant="secondary">Score: {detail.score_earned != null ? Math.round(detail.score_earned) : 0} / {detail.exam_question.score_value}</Badge>
                                </div>
                            </div>
                            <CardDescription dangerouslySetInnerHTML={{ __html: detail.exam_question.content }} />
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-md border p-3 bg-muted/50">
                                    <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Student Answer</div>
                                    <div className="text-sm">
                                        {/* jawaban siswa */}
                                        {detail.exam_question.question_type === 'multiple_choice' ? (
                                            <PreviewStudentAnswerMultipleChoice
                                                options={detail.exam_question.options}
                                                studentAnswer={detail.student_answer}
                                                keyAnswer={detail.exam_question.key_answer}
                                                showMedia={false}
                                                showKeyAnswer={true}
                                                showStudentAnswer={true}
                                            />
                                        ) : detail.exam_question.question_type === 'multiple_selection' ? (
                                            <PreviewStudentAnswerMultipleSelection
                                                options={detail.exam_question.options}
                                                studentAnswer={detail.student_answer}
                                                keyAnswer={detail.exam_question.key_answer}
                                                showMedia={false}
                                                showKeyAnswer={true}
                                                showStudentAnswer={true}
                                            />
                                        ) : (
                                            typeof detail.student_answer === 'object' ? JSON.stringify(detail.student_answer) : (detail.student_answer || '-')
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-md border p-3 bg-green-50 dark:bg-green-950/20">
                                    <div className="text-xs font-semibold uppercase text-green-700 dark:text-green-400 mb-2">Key Answer</div>
                                    <div className="text-sm">
                                        {/* jawaban key */}
                                        {detail.exam_question.question_type === 'multiple_choice' ? (
                                            <PreviewStudentAnswerMultipleChoice
                                                options={detail.exam_question.options}
                                                studentAnswer={detail.student_answer}
                                                keyAnswer={detail.exam_question.key_answer}
                                                showMedia={false}
                                                showKeyAnswer={true}
                                                showStudentAnswer={false}
                                            />
                                        ) : detail.exam_question.question_type === 'multiple_selection' ? (
                                            <PreviewStudentAnswerMultipleSelection
                                                options={detail.exam_question.options}
                                                studentAnswer={detail.student_answer}
                                                keyAnswer={detail.exam_question.key_answer}
                                                showMedia={false}
                                                showKeyAnswer={true}
                                                showStudentAnswer={false}
                                            />
                                        ) : (
                                            typeof detail.student_answer === 'object' ? JSON.stringify(detail.student_answer) : (detail.student_answer || '-')
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
