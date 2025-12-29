<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ExamSession;
use App\Models\ExamResultDetail;

class InspectAnswers extends Command
{
    protected $signature = 'inspect:answers {session_id?}';
    protected $description = 'Inspect student answers and key answers for a session';

    public function handle()
    {
        $sessionId = $this->argument('session_id');

        if (!$sessionId) {
            $session = ExamSession::latest()->first();
            if (!$session) {
                $this->error('No sessions found.');
                return;
            }
            $sessionId = $session->id;
        }

        $session = ExamSession::with('examResultDetails.examQuestion')->find($sessionId);

        if (!$session) {
            $this->error("Session $sessionId not found.");
            return;
        }

        $this->info("Inspecting Session: $sessionId (User: {$session->user_id})");
        $this->info("---------------------------------------------------");

        foreach ($session->examResultDetails as $detail) {
            $q = $detail->examQuestion;
            $type = $q->question_type->value;

            $this->info("Question {$detail->question_number} ($type)");

            $studentRaw = $detail->getAttributes()['student_answer'] ?? 'NULL'; // Get RAW attribute
            $studentCast = $detail->student_answer;

            $keyRaw = $q->getAttributes()['key_answer'] ?? 'NULL';
            $keyCast = $q->key_answer;

            $this->line("Raw Student: " . (is_string($studentRaw) ? $studentRaw : json_encode($studentRaw)));
            $this->line("Cast Student (" . gettype($studentCast) . "): " . json_encode($studentCast));

            $this->line("Raw Key:     " . (is_string($keyRaw) ? $keyRaw : json_encode($keyRaw)));
            $this->line("Cast Key (" . gettype($keyCast) . "):     " . json_encode($keyCast));

            // Check logic specific to Ordering
            if ($type === 'ordering') {
                $correctOrder = $keyCast['order'] ?? [];
                $match = ($studentCast == $correctOrder);
                $this->info("Ordering Match (==): " . ($match ? 'TRUE' : 'FALSE'));
            }

            $this->info("---------------------------------------------------");
        }
    }
}
