<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateQuestionsWithAI;
use App\Models\QuestionBank;
use App\Models\Subject;
use App\Services\QuestionImportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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
     * Display the specified resource.
     */
    public function show(QuestionBank $questionBank)
    {
        // Load relasi
        $questionBank->load(['subject.grade', 'teacher', 'questions.options', 'questions.tags']);

        // Inject Media URLs untuk questions dan options
        $questionBank->questions->transform(function ($question) {
            $question->media_url = $question->getFirstMediaUrl('question_content');

            $question->options->transform(function ($option) {
                $option->media_url = $option->getFirstMediaUrl('option_media');
                return $option;
            });

            return $question;
        });

        // Load Suggestions ONLY if current user is owner
        $suggestions = [];
        if (Auth::id() === $questionBank->user_id) {
            // We use HasManyThrough relationship
            $suggestions = $questionBank->suggestions()
                ->with(['user', 'question'])
                ->latest()
                ->get();
        }

        return Inertia::render('admin/question-banks/show', [
            'questionBank' => $questionBank,
            'questions' => $questionBank->questions,
            'suggestions' => $suggestions, // Pass suggestions to view
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(QuestionBank $questionBank)
    {
        // Load questions associated with this question bank
        $questionBank->load(['questions.options', 'questions.tags']);

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

        return redirect()->route('admin.question-banks.index')
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

    /**
     * Upload questions from Word document
     */
    public function uploadQuestions(Request $request, QuestionBank $questionBank)
    {
        // Validate file upload
        $request->validate([
            'file' => 'required|file|mimes:docx|max:10240', // Max 10MB
        ]);

        try {
            // Get uploaded file
            $file = $request->file('file');

            // Generate unique filename to avoid conflicts
            $fileName = time() . '_' . $file->getClientOriginalName();

            // Store temporarily with proper path
            $tempPath = $file->storeAs('temp', $fileName, 'local');
            $fullPath = Storage::disk('local')->path($tempPath);

            // Debug logging
            Log::info('File upload success', [
                'original_name' => $file->getClientOriginalName(),
                'stored_name' => $fileName,
                'temp_path' => $tempPath,
                'full_path' => $fullPath,
                'file_exists' => file_exists($fullPath),
                'is_readable' => is_readable($fullPath),
                'file_size' => file_exists($fullPath) ? filesize($fullPath) : 0
            ]);

            // Verify file exists before parsing
            if (!file_exists($fullPath)) {
                throw new \Exception("File tidak ditemukan setelah upload: {$fullPath}");
            }

            // Verify file is readable
            if (!is_readable($fullPath)) {
                throw new \Exception("File tidak dapat dibaca: {$fullPath}");
            }

            // Parse document using service
            $importService = new QuestionImportService();
            $result = $importService->parseWordDocument($fullPath, $questionBank->id);

            // Delete temp file after processing
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }

            // Prepare response message
            if ($result['success']) {
                $message = "Berhasil mengupload {$result['total']} soal.";

                if (!empty($result['errors'])) {
                    $message .= " " . count($result['errors']) . " baris ada error.";
                }

                return back()->with('success', $message);
            } else {
                return back()->withErrors([
                    'upload' => 'Gagal mengupload soal: ' . implode(', ', $result['errors'])
                ]);
            }
        } catch (\Exception $e) {
            // Log full error for debugging
            Log::error('Question upload error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'upload' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Download template for question upload
     */
    public function downloadTemplate()
    {
        $templateService = new \App\Services\QuestionTemplateService();
        $filePath = $templateService->generateTemplate();

        return response()->download($filePath, 'Template_Upload_Soal.docx');
    }

    /**
     * Generate questions using AI
     */
    public function generateWithAI(Request $request, QuestionBank $questionBank)
    {
        $validated = $request->validate([
            'topic' => 'required|string|max:255',
            'question_type' => 'required|string',
            'count' => 'required|integer|min:1|max:5',
            'difficulty' => 'required|string|in:mudah,sedang,sulit',
        ]);

        // Dispatch Job
        \App\Jobs\GenerateQuestionsWithAI::dispatch(
            $questionBank->id,
            $validated['question_type'],
            $validated['topic'],
            $validated['count'],
            $validated['difficulty']
        );

        return back()->with('success', 'AI sedang membuat soal. Soal akan muncul dalam beberapa menit.');
    }

    /**
     * Generate tags for all questions using AI
     */
    public function generateTags(QuestionBank $questionBank)
    {
        // Check if question bank has questions
        $questionCount = $questionBank->questions()->count();

        if ($questionCount === 0) {
            return back()->with('error', 'Tidak ada pertanyaan untuk di-generate tag-nya.');
        }

        // Dispatch Job
        \App\Jobs\GenerateQuestionTags::dispatch($questionBank->id);

        return back()->with('success', "AI sedang membuat tag untuk {$questionCount} pertanyaan. Tag akan muncul dalam beberapa menit.");
    }
}
