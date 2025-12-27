<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $activeExams = [
            [
                'id' => '1',
                'title' => 'Mid-term Mathematics',
                'subject' => 'Mathematics',
                'grade' => 'Grade 10',
                'duration' => 90,
                'end_time' => now()->addDays(2)->toIso8601String(),
                'has_started' => false,
            ],
            [
                'id' => '2',
                'title' => 'Biology Quiz',
                'subject' => 'Science',
                'grade' => 'Grade 10',
                'duration' => 45,
                'end_time' => now()->addDays(1)->toIso8601String(),
                'has_started' => true,
            ],
        ];

        $recentResults = [
            [
                'id' => '1',
                'title' => 'History Pop Quiz',
                'subject' => 'History',
                'score' => 85,
                'date' => now()->subDays(2)->toIso8601String(),
            ],
            [
                'id' => '2',
                'title' => 'Physics Lab Test',
                'subject' => 'Physics',
                'score' => 65,
                'date' => now()->subDays(5)->toIso8601String(),
            ],
        ];

        return Inertia::render('student/dashboard', [
            'activeExams' => $activeExams,
            'recentResults' => $recentResults,
        ]);
    }
}
