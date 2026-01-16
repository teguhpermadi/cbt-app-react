<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\QuestionBank;
use App\Models\QuestionSuggestion;
use App\Models\User;
use App\States\QuestionSuggestion\Approved;
use App\States\QuestionSuggestion\Pending;
use App\States\QuestionSuggestion\Rejected;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuestionSuggestionTest extends TestCase
{
    // WARNING: Use with caution if standard migration fails. 
    // We assume migration is working based on previous verification.
    use RefreshDatabase;

    public function test_user_can_create_suggestion()
    {
        $user = User::factory()->create();
        $owner = User::factory()->create();
        $bank = QuestionBank::factory()->create(['user_id' => $owner->id, 'is_public' => true]);
        // Create question with explicit content
        $question = Question::factory()->create([
            'question_bank_id' => $bank->id,
            'content' => 'Original Content'
        ]);

        $suggestionData = ['content' => 'Proposed Content'];

        $suggestion = QuestionSuggestion::create([
            'question_id' => $question->id,
            'user_id' => $user->id,
            'data' => $suggestionData,
            'description' => 'Fix typo',
            'state' => Pending::class,
        ]);

        $this->assertDatabaseHas('question_suggestions', [
            'id' => $suggestion->id,
            'state' => 'pending',
        ]);

        $this->assertEquals('Proposed Content', $suggestion->data['content']);
    }

    public function test_approving_suggestion_updates_question_and_versions()
    {
        $owner = User::factory()->create();
        $bank = QuestionBank::factory()->create(['user_id' => $owner->id]);
        $question = Question::factory()->create([
            'question_bank_id' => $bank->id,
            'content' => 'Old Content'
        ]);

        $suggestion = QuestionSuggestion::factory()->create([
            'question_id' => $question->id,
            'data' => ['content' => 'New Content'],
            'state' => Pending::class,
        ]);

        // Act: Apply Transition manually (mimicking Controller action)
        $suggestion->state->transitionTo(Approved::class);

        // Assert: Question is updated
        $question->refresh();
        $this->assertEquals('New Content', $question->content);

        // Assert: Version is created (Original content should be in history)
        // Note: Versionable stores the state *before* update if configured, 
        // or we check if versions table has entry.
        $this->assertNotEmpty($question->versions);
        // Logic depends on Versionable config, usually 1 version created per update if enabled.

        // Assert: Suggestion state is Approved
        $this->assertTrue($suggestion->refresh()->state->equals(Approved::class));
    }

    public function test_rejecting_suggestion_does_not_update_question()
    {
        $question = Question::factory()->create(['content' => 'Original Content']);
        $suggestion = QuestionSuggestion::factory()->create([
            'question_id' => $question->id,
            'data' => ['content' => 'Bad Content'],
            'state' => Pending::class,
        ]);

        // Act
        $suggestion->state->transitionTo(Rejected::class);

        // Assert
        $question->refresh();
        $this->assertEquals('Original Content', $question->content);
        $this->assertTrue($suggestion->refresh()->state->equals(Rejected::class));
    }
}
