<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\User;
use App\Models\Option;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OptionMediaTest extends TestCase
{
    // use RefreshDatabase; // Caution: might wipe DB if not configured for testing sqlite in memory

    public function test_can_upload_media_to_option()
    {
        // 1. Setup User & Question
        $user = User::factory()->create(['role' => 'admin']); // Adjust role as needed
        $question = Question::factory()->create();

        // 2. Mock Storage
        Storage::fake('public');
        $file = UploadedFile::fake()->image('option_image.jpg');

        // 3. Prepare Payload
        // Simulate structure sent by Inertia/FormData
        $payload = [
            'content' => 'Updated Question Content',
            'question_type' => $question->question_type, // Keep original
            'difficulty_level' => $question->difficulty_level,
            'timer' => $question->timer,
            'score_value' => $question->score_value,
            'options' => [
                [
                    'option_key' => 'A',
                    'content' => 'Option A Content',
                    'is_correct' => false,
                    'order' => 0,
                    'media_file' => $file, // The file upload
                ]
            ],
        ];

        // 4. Send PUT Request (Method Spoofing)
        // Note: For file uploads with PUT, Laravel usually requires POST + _method=PUT
        $response = $this->actingAs($user)
            ->post(route('admin.questions.update', $question->id), array_merge($payload, ['_method' => 'PUT']));

        // 5. Assertions
        $response->assertRedirect();

        $option = Option::where('question_id', $question->id)->where('option_key', 'A')->first();
        $this->assertNotNull($option, 'Option should be created/updated');

        // Check Media
        $this->assertTrue($option->hasMedia('option_media'), 'Option should have media attached');
    }
}
