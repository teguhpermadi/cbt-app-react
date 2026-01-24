<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ReproduceUploadError extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'debug:reproduce-upload';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Try to reproduce the file upload error';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting reproduction attempt...');

        // create dummy file
        $tempFile = sys_get_temp_dir() . '/test_upload.docx';
        file_put_contents($tempFile, 'dummy content');

        $this->info("Created dummy file at: $tempFile");

        try {
            // Simulate UploadedFile
            $file = new UploadedFile(
                $tempFile,
                'test_upload.docx',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                null,
                true // test mode
            );

            $fileName = time() . '_test_upload.docx';
            $this->info("Attempting storeAs with filename: $fileName");

            $tempPath = $file->storeAs('temp', $fileName, 'local');

            $this->info("Success! Path: $tempPath");

            // Cleanup
            if (Storage::disk('local')->exists($tempPath)) {
                Storage::disk('local')->delete($tempPath);
            }
        } catch (\Throwable $e) {
            $this->error("Caught Exception: " . $e->getMessage());
            $this->error("File: " . $e->getFile());
            $this->error("Line: " . $e->getLine());
            $this->error($e->getTraceAsString());
        } finally {
            if (file_exists($tempFile)) {
                unlink($tempFile);
            }
        }
    }
}
