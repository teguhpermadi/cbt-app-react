<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReadingMaterial;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReadingMaterialController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'question_bank_id' => 'required|exists:question_banks,id',
        ]);

        return Inertia::render('admin/reading-materials/create', [
            'question_bank_id' => $request->question_bank_id,
            // Subjects are inferred from QuestionBank usually, but kept for compatibility if needed.
            // Actually better to just pass the bank details if possible or fetch them.
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'question_bank_id' => 'required|exists:question_banks,id',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf|max:10240',
        ]);



        $material = DB::transaction(function () use ($request) {
            // Fetch subject_id from QuestionBank
            $bank = \App\Models\QuestionBank::find($request->question_bank_id);

            $material = ReadingMaterial::create([
                'question_bank_id' => $request->question_bank_id,
                'subject_id' => $bank->subject_id,
                'user_id' => $request->user()->id,
                'title' => $request->title,
                'content' => $request->content ?? '',
            ]);

            if ($request->hasFile('file')) {
                $material->addMediaFromRequest('file')
                    ->toMediaCollection('reading_material_file');
            }

            return $material;
        });

        // Redirect to the new Manage Page (Split View)
        return redirect()->route('admin.reading-materials.edit', $material->id)
            ->with('success', 'Bahan bacaan berhasil dibuat. Silakan tambahkan pertanyaan.');
    }

    public function show(ReadingMaterial $readingMaterial)
    {
        // Redirect to edit page which is now the main view for managing it
        return redirect()->route('admin.reading-materials.edit', $readingMaterial->id);
    }

    public function edit(ReadingMaterial $readingMaterial)
    {
        $readingMaterial->load(['questionBank', 'questions.options', 'questions.tags', 'media']);

        return Inertia::render('admin/reading-materials/manage', [
            'readingMaterial' => $readingMaterial,
            'questionBank' => $readingMaterial->questionBank,
            'questions' => $readingMaterial->questions,
            'mediaUrl' => $readingMaterial->getFirstMediaUrl('reading_material_file'),
        ]);
    }

    public function update(Request $request, ReadingMaterial $readingMaterial)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        DB::transaction(function () use ($request, $readingMaterial) {
            $readingMaterial->update([
                'title' => $request->title,
                'content' => $request->content ?? '',
            ]);

            if ($request->hasFile('file')) {
                $readingMaterial->clearMediaCollection('reading_material_file');
                $readingMaterial->addMediaFromRequest('file')
                    ->toMediaCollection('reading_material_file');
            }
        });

        return back()->with('success', 'Bahan bacaan berhasil diperbarui.');
    }

    public function destroy(ReadingMaterial $readingMaterial)
    {
        $bankId = $readingMaterial->question_bank_id;
        $readingMaterial->delete();

        return redirect()->route('admin.question-banks.edit', ['question_bank' => $bankId, 'tab' => 'reading_materials'])
            ->with('success', 'Bahan bacaan berhasil dihapus.');
    }
}
