<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\QuestionSuggestion;
use App\States\QuestionSuggestion\Approved;
use App\States\QuestionSuggestion\Rejected;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QuestionSuggestionController extends Controller
{
    /**
     * Display a listing of suggestions.
     */
    public function index()
    {
        $user = auth()->user();

        // 1. Received Suggestions (Saran Masuk)
        $receivedQuery = QuestionSuggestion::query()
            ->with(['question', 'question.questionBank', 'question.author', 'user'])
            ->latest();

        if ($user->hasRole('admin')) {
            // Admin sees all suggestions
        } else {
            // Teacher sees suggestions for:
            // 1. Questions they authored
            // 2. Questions in QuestionBanks they own (so they can moderate)
            $receivedQuery->whereHas('question', function ($q) use ($user) {
                $q->where('author_id', $user->id)
                    ->orWhereHas('questionBank', function ($qb) use ($user) {
                        $qb->where('user_id', $user->id);
                    });
            });
        }

        $receivedSuggestions = $receivedQuery->get();

        // 2. Sent Suggestions (Saran Terkirim)
        // Suggestions made BY the logged-in user to others
        $sentSuggestions = QuestionSuggestion::query()
            ->with(['question', 'question.questionBank', 'question.author'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return Inertia::render('admin/question-suggestions/index', [
            'receivedSuggestions' => $receivedSuggestions,
            'sentSuggestions' => $sentSuggestions,
        ]);
    }
    /**
     * Store a newly created suggestion in storage.
     */
    public function store(Request $request, Question $question)
    {
        $request->validate([
            'description' => 'required|string',
            'data' => 'sometimes|array', // The suggested question data
        ]);

        // Prevent owner from upgrading their own question via suggestion (they should just edit)
        if ($request->user()->id === $question->questionBank->user_id) {
            return back()->with('error', 'You cannot submit a suggestion for your own question. Use Edit instead.');
        }

        QuestionSuggestion::create([
            'question_id' => $question->id,
            'user_id' => $request->user()->id,
            'description' => $request->description,
            'data' => $request->data,
        ]);

        return back()->with('success', 'Suggestion submitted successfully.');
    }

    /**
     * Approve the specified suggestion.
     */
    public function approve(QuestionSuggestion $suggestion)
    {
        // Authorization: Only the owner of the question bank can approve
        if (request()->user()->id !== $suggestion->question->questionBank->user_id) {
            abort(403, 'Unauthorized action.');
        }

        try {
            DB::transaction(function () use ($suggestion) {
                // Determine if state transition is allowed
                if ($suggestion->state->canTransitionTo(Approved::class)) {
                    $suggestion->state->transitionTo(Approved::class);
                }
            });

            return back()->with('success', 'Suggestion approved and applied.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to approve suggestion: ' . $e->getMessage());
        }
    }

    /**
     * Reject the specified suggestion.
     */
    public function reject(QuestionSuggestion $suggestion)
    {
        // Authorization: Only the owner
        if (request()->user()->id !== $suggestion->question->questionBank->user_id) {
            abort(403, 'Unauthorized action.');
        }

        if ($suggestion->state->canTransitionTo(Rejected::class)) {
            $suggestion->state->transitionTo(Rejected::class);
        }

        return back()->with('success', 'Suggestion rejected.');
    }

    /**
     * Update the specified suggestion (e.g. fix typos before approving).
     */
    public function update(Request $request, QuestionSuggestion $suggestion)
    {
        // Authorization: Owner of QuestionBank OR Creator of Suggestion
        if ($request->user()->id !== $suggestion->question->questionBank->user_id && $request->user()->id !== $suggestion->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'description' => 'required|string',
            'content' => 'sometimes|string', // Frontend sends 'content' separately in my specific implementation
        ]);

        $data = $suggestion->data ?? [];

        // Update content in data array if provided
        if ($request->has('content')) {
            $data['content'] = $request->input('content');
        }

        $suggestion->update([
            'description' => $request->description,
            'data' => $data,
        ]);

        return back()->with('success', 'Suggestion updated successfully.');
    }

    /**
     * Remove the specified suggestion.
     */
    public function destroy(QuestionSuggestion $suggestion)
    {
        // Authorization: Owner of QuestionBank OR Creator of Suggestion
        if (request()->user()->id !== $suggestion->question->questionBank->user_id && request()->user()->id !== $suggestion->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $suggestion->delete();

        return back()->with('success', 'Suggestion deleted successfully.');
    }
}
