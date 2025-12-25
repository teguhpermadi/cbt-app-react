<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Question $question)
    {
        $validated = $request->validate([
            'difficulty_level' => 'nullable|string',
            'timer' => 'nullable|numeric',
            'score_value' => 'nullable|numeric',
            // Add other fields as necessary
        ]);

        $question->update($validated);

        return back()->with('success', 'Soal berhasil diperbarui.');
    }

    /**
     * Reorder questions.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:questions,id',
        ]);

        foreach ($request->ids as $index => $id) {
            Question::where('id', $id)->update(['order' => $index + 1]);
        }

        return back()->with('success', 'Urutan soal berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        $question->delete();

        return back()->with('success', 'Soal berhasil dihapus.');
    }
}
