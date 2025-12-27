<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Exam;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;

// Create a teacher if not exists
$teacher = User::where('user_type', 'teacher')->first();
if (!$teacher) {
    $teacher = User::factory()->create(['user_type' => 'teacher']);
}

// Create a published active exam
$exam = Exam::factory()->create([
    'teacher_id' => $teacher->id,
    'is_published' => true,
    'start_time' => now()->subMinute(),
    'end_time' => now()->addHour(),
]);

echo "Initial Token: " . $exam->token . "\n";
echo "Is Visible: " . ($exam->is_token_visible ? 'Yes' : 'No') . "\n";

$initialToken = $exam->token;

// Run rotation command
echo "Running rotation command...\n";
Artisan::call('exam:rotate-tokens');
echo Artisan::output();

// Refresh exam
$exam->refresh();

echo "New Token: " . $exam->token . "\n";

if ($initialToken !== $exam->token) {
    echo "SUCCESS: Token changed!\n";
} else {
    echo "FAILURE: Token did not change.\n";
}
