<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Option;
use App\Enums\QuestionTypeEnum;
use App\Enums\DifficultyLevelEnum;
use App\Enums\TimerEnum;
use App\Enums\QuestionScoreEnum;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class QuestionController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $request->validate([
            'question_bank_id' => 'required|exists:question_banks,id',
        ]);

        return Inertia::render('admin/questions/create', [
            'question_bank_id' => $request->question_bank_id,
            'types' => QuestionTypeEnum::cases(),
            'difficulties' => DifficultyLevelEnum::cases(),
            'timers' => TimerEnum::cases(),
            'scores' => QuestionScoreEnum::cases(),
            'order' => $request->order,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validate Basic Question Data
        $validated = $request->validate([
            'question_bank_id' => 'required|exists:question_banks,id',
            'content' => 'required|string',
            'question_type' => ['required', 'string', \Illuminate\Validation\Rule::in(array_column(QuestionTypeEnum::cases(), 'value'))],
            'difficulty_level' => ['required', 'string', \Illuminate\Validation\Rule::in(array_column(DifficultyLevelEnum::cases(), 'value'))],
            'timer' => ['required', 'integer', \Illuminate\Validation\Rule::in(array_column(TimerEnum::cases(), 'value'))],
            'score_value' => ['required', 'integer', \Illuminate\Validation\Rule::in(array_column(QuestionScoreEnum::cases(), 'value'))],

            'question_media' => 'nullable|file|image|max:2048', // Max 2MB

            // Options Validation
            'options' => 'array',
            'options.*.media_file' => 'nullable|file|image|max:2048',
        ]);

        $question = DB::transaction(function () use ($request, $validated) {
            // 2. Create Question
            $maxOrder = Question::where('question_bank_id', $validated['question_bank_id'])->max('order');

            // Determine Order
            $forceOrder = request()->input('order');
            if ($forceOrder) {
                // Shift existing questions
                Question::where('question_bank_id', $validated['question_bank_id'])
                    ->where('order', '>=', $forceOrder)
                    ->increment('order');
                $order = $forceOrder;
            } else {
                $order = $maxOrder ? $maxOrder + 1 : 1;
            }

            $question = Question::create([
                'question_bank_id' => $validated['question_bank_id'],
                'content' => $validated['content'],
                'question_type' => $validated['question_type'],
                'difficulty_level' => $validated['difficulty_level'],
                'timer' => $validated['timer'],
                'score_value' => $validated['score_value'],
                'order' => $order,
                'is_active' => true,
            ]);

            // Handle Question Media
            if ($request->hasFile('question_media')) {
                $question->addMediaFromRequest('question_media')->toMediaCollection('question_content');
            }

            // 3. Handle Options
            $requestOptions = collect($request->input('options', []));

            foreach ($requestOptions as $index => $optData) {
                $optionData = [
                    'question_id' => $question->id,
                    'option_key' => $optData['option_key'] ?? $this->generateDefaultKey($question->question_type, $index),
                    'content' => $optData['content'] ?? '',
                    'is_correct' => filter_var($optData['is_correct'] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'order' => $optData['order'] ?? $index,
                    'metadata' => $optData['metadata'] ?? null,
                ];

                $option = Option::create($optionData);

                // Handle Option Media
                // Retrieve file using dot notation for nested array
                if ($request->hasFile("options.$index.media_file")) {
                    $file = $request->file("options.$index.media_file");
                    $option->addMedia($file)->toMediaCollection('option_media');
                }
            }

            // 4. Handle Tags
            if ($request->has('tags')) {
                $question->attachTags($request->tags);
            }

            // 4. Handle Tags
            if ($request->has('tags')) {
                $question->attachTags($request->tags);
            }

            return $question;
        });

        return to_route('admin.question-banks.edit', [
            'question_bank' => $question->question_bank_id,
            'scrollTo' => "question-{$question->id}"
        ])->with('success', 'Soal berhasil dibuat.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        $question->load('options');

        // Inject Media URLs for Frontend
        $question->media_url = $question->getFirstMediaUrl('question_content');

        $question->options->transform(function ($option) {
            $option->media_url = $option->getFirstMediaUrl('option_media');
            return $option;
        });

        return Inertia::render('admin/questions/edit', [
            'question' => $question,
            'types' => QuestionTypeEnum::cases(),
            'difficulties' => DifficultyLevelEnum::cases(),
            'timers' => TimerEnum::cases(),
            'scores' => QuestionScoreEnum::cases(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Question $question)
    {
        // 1. Validate Basic Question Data
        $validated = $request->validate([
            'content' => 'required|string',
            'question_type' => ['required', 'string', \Illuminate\Validation\Rule::in(array_column(QuestionTypeEnum::cases(), 'value'))],
            'difficulty_level' => ['required', 'string', \Illuminate\Validation\Rule::in(array_column(DifficultyLevelEnum::cases(), 'value'))],
            'timer' => ['required', 'integer', \Illuminate\Validation\Rule::in(array_column(TimerEnum::cases(), 'value'))],
            'score_value' => ['required', 'integer', \Illuminate\Validation\Rule::in(array_column(QuestionScoreEnum::cases(), 'value'))],

            'question_media' => 'nullable|file|image|max:2048', // Max 2MB
            'delete_question_media' => 'nullable|boolean',

            // Options Validation
            'options' => 'array',
            'options.*.media_file' => 'nullable|file|image|max:2048',
        ]);

        DB::transaction(function () use ($request, $question, $validated) {
            // 2. Update Question
            $question->update([
                'content' => $validated['content'],
                'question_type' => $validated['question_type'],
                'difficulty_level' => $validated['difficulty_level'],
                'timer' => $validated['timer'],
                'score_value' => $validated['score_value'],
            ]);

            // Handle Question Media
            if ($request->hasFile('question_media')) {
                $question->clearMediaCollection('question_content');
                $question->addMediaFromRequest('question_media')->toMediaCollection('question_content');
            } elseif ($request->boolean('delete_question_media')) {
                $question->clearMediaCollection('question_content');
            }

            // 3. Handle Options
            $requestOptions = collect($request->input('options', []));
            $existingOptionIds = $question->options()->pluck('id')->toArray();

            // Note: Request options might not have ID if they are new, but indices align if structure is maintained.
            // However, Inertia sends JSON. When file uploads are involved, inputs are converted to FormData.
            // Key mapping is crucial.

            $incomingOptionIds = collect($requestOptions)->pluck('id')->filter()->toArray();

            // Delete removed options
            $idsToDelete = array_diff($existingOptionIds, $incomingOptionIds);
            Option::destroy($idsToDelete);

            // Update or Create
            foreach ($requestOptions as $index => $optData) {
                $optionData = [
                    'question_id' => $question->id,
                    'option_key' => $optData['option_key'] ?? $this->generateDefaultKey($question->question_type, $index),
                    'content' => $optData['content'] ?? '',
                    'is_correct' => filter_var($optData['is_correct'] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'order' => $optData['order'] ?? $index,
                    'metadata' => $optData['metadata'] ?? null,
                ];

                if (isset($optData['id']) && $optData['id']) {
                    $option = Option::find($optData['id']);
                    $option->update($optionData);
                } else {
                    $option = Option::create($optionData);
                }

                // Handle Option Media
                // Retrieve file using dot notation for nested array
                if ($request->hasFile("options.$index.media_file")) {
                    $file = $request->file("options.$index.media_file");
                    $option->clearMediaCollection('option_media');
                    $option->addMedia($file)->toMediaCollection('option_media');
                } elseif (isset($optData['delete_media']) && filter_var($optData['delete_media'], FILTER_VALIDATE_BOOLEAN)) {
                    $option->clearMediaCollection('option_media');
                }
            }

            // 4. Handle Tags
            if ($request->has('tags')) {
                $question->syncTags($request->tags);
            }
        });

        return to_route('admin.question-banks.edit', [
            'question_bank' => $question->question_bank_id,
            'scrollTo' => "question-{$question->id}"
        ])->with('success', 'Soal berhasil diperbarui.');
    }

    private function generateDefaultKey($type, $index)
    {
        // Fallback key generation if frontend doesn't send it provided
        // Mostly relevant for new options
        if ($type === QuestionTypeEnum::MultipleChoice->value || $type === QuestionTypeEnum::MultipleSelection->value) {
            return chr(65 + $index); // A, B, C...
        }
        return (string)($index + 1);
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
