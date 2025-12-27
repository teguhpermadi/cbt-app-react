<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuestionBank;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuestionBankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $questionBanks = QuestionBank::query()
            ->with(['subject.grade', 'teacher'])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/question-banks/index', [
            'questionBanks' => $questionBanks,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Ambil subject yang aktif (berdasarkan tahun ajaran aktif)
        $subjects = Subject::query()
            ->whereHas('academicYear', function ($query) {
                $query->active();
            })
            ->with('grade')
            ->get()
            ->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    'name' => $subject->name . ' - ' . ($subject->grade->name ?? 'No Grade'),
                ];
            });

        return Inertia::render('admin/question-banks/create', [
            'subjects' => $subjects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
        ]);

        $validated['user_id'] = Auth::id();

        $questionBank = QuestionBank::create($validated);

        return redirect()->route('admin.question-banks.edit', $questionBank)
            ->with('success', 'Bank Soal berhasil dibuat.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(QuestionBank $questionBank)
    {
        // Load questions associated with this question bank
        $questionBank->load(['questions.options']);

        // Inject Media URLs
        $questionBank->questions->transform(function ($question) {
            $question->media_url = $question->getFirstMediaUrl('question_content');

            $question->options->transform(function ($option) {
                $option->media_url = $option->getFirstMediaUrl('option_media');
                return $option;
            });

            return $question;
        });

        // Ambil subject yang aktif (berdasarkan tahun ajaran aktif)
        $subjects = Subject::query()
            ->whereHas('academicYear', function ($query) {
                $query->active();
            })
            ->with('grade')
            ->get()
            ->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    'name' => $subject->name . ' - ' . ($subject->grade->name ?? 'No Grade'),
                ];
            });

        return Inertia::render('admin/question-banks/edit', [
            'questionBank' => $questionBank,
            'questions' => $questionBank->questions,
            'subjects' => $subjects,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, QuestionBank $questionBank)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
        ]);

        $questionBank->update($validated);

        return redirect()->back()
            ->with('success', 'Bank Soal berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QuestionBank $questionBank)
    {
        $questionBank->delete();

        return redirect()->route('admin.question-banks.index')
            ->with('success', 'Bank Soal berhasil dihapus.');
    }
}
