<?php

namespace App\Mcp\Tools;

use Illuminate\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;

class ReadLogsTool extends Tool
{
    /**
     * The tool's description.
     */
    protected string $description = <<<'MARKDOWN'
        Read the latest entries from the Laravel application log file.
        
        This tool is useful for:
        - Debugging errors and exceptions
        - Monitoring application behavior
        - Analyzing error patterns
        - Troubleshooting issues
    MARKDOWN;

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $lines = $request->input('lines', 50);
        $level = $request->input('level', '');

        $logFile = storage_path('logs/laravel.log');

        if (!file_exists($logFile)) {
            return Response::text('Log file not found. No logs have been written yet.');
        }

        try {
            // Read the file from the end
            $file = new \SplFileObject($logFile, 'r');
            $file->seek(PHP_INT_MAX);
            $lastLine = $file->key();

            $logLines = [];
            $startLine = max(0, $lastLine - $lines * 10); // Read more lines to account for multi-line entries

            $file->seek($startLine);
            while (!$file->eof()) {
                $logLines[] = $file->fgets();
            }

            // Get last N lines
            $logLines = array_slice($logLines, -$lines);

            // Filter by level if specified
            if ($level) {
                $logLines = array_filter($logLines, function ($line) use ($level) {
                    return stripos($line, ".{$level}:") !== false;
                });
            }

            $output = [
                'log_file' => $logFile,
                'lines_requested' => $lines,
                'level_filter' => $level ?: 'none',
                'lines_returned' => count($logLines),
                'logs' => implode('', $logLines),
            ];

            return Response::text(json_encode($output, JSON_PRETTY_PRINT));
        } catch (\Exception $e) {
            return Response::text("Error reading log file: " . $e->getMessage());
        }
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, \Illuminate\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'lines' => $schema->integer()
                ->description('Number of log lines to read from the end of the file (default: 50)')
                ->default(50),
            'level' => $schema->string()
                ->description('Optional log level filter (e.g., "ERROR", "WARNING", "INFO", "DEBUG")'),
        ];
    }
}
