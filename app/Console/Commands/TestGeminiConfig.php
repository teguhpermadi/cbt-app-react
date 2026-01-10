<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TestGeminiConfig extends Command
{
    protected $signature = 'test:gemini-config';
    protected $description = 'Test Gemini API configuration';

    public function handle()
    {
        $apiKey = config('prism.providers.gemini.api_key');

        if (empty($apiKey)) {
            $this->error('❌ GEMINI_API_KEY is NOT set or is empty!');
            $this->warn('Please add GEMINI_API_KEY to your .env file.');
            return 1;
        }

        $masked = substr($apiKey, 0, 10) . '...' . substr($apiKey, -4);
        $this->info("✅ GEMINI_API_KEY is set: {$masked}");
        $this->info("Key length: " . strlen($apiKey) . " characters");

        return 0;
    }
}
