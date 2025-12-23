<?php

namespace App\Mcp\Tools;

use Illuminate\JsonSchema\JsonSchema;
use Illuminate\Support\Facades\Artisan;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;

class RunArtisanTool extends Tool
{
    /**
     * The tool's description.
     */
    protected string $description = <<<'MARKDOWN'
        Execute safe Laravel Artisan commands and return their output.
        
        **Security**: Only whitelisted read-only commands are allowed.
        
        Allowed commands:
        - route:list - List all registered routes
        - migrate:status - Show migration status
        - config:show - Show configuration values
        - about - Display application information
        - db:show - Display database information
        - db:table - Display table information
        - model:show - Display model information
        - schedule:list - List scheduled commands
        - event:list - List application events
    MARKDOWN;

    /**
     * Whitelisted safe commands
     */
    protected array $allowedCommands = [
        'route:list',
        'migrate:status',
        'config:show',
        'about',
        'db:show',
        'db:table',
        'model:show',
        'schedule:list',
        'event:list',
    ];

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $command = $request->input('command');
        $arguments = $request->input('arguments', []);

        // Extract base command (without arguments)
        $baseCommand = explode(' ', $command)[0];

        // Check if command is whitelisted
        if (!in_array($baseCommand, $this->allowedCommands)) {
            return Response::text(
                "Error: Command '{$baseCommand}' is not allowed.\n\n" .
                    "Allowed commands:\n" . implode("\n", array_map(fn($cmd) => "- {$cmd}", $this->allowedCommands))
            );
        }

        try {
            // Capture artisan output
            $exitCode = Artisan::call($command, $arguments);
            $output = Artisan::output();

            $result = [
                'command' => $command,
                'arguments' => $arguments,
                'exit_code' => $exitCode,
                'output' => $output,
            ];

            return Response::text(json_encode($result, JSON_PRETTY_PRINT));
        } catch (\Exception $e) {
            return Response::text("Error executing command: " . $e->getMessage());
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
            'command' => $schema->string()
                ->description('The Artisan command to execute (must be from the whitelist)')
                ->required(),
            'arguments' => $schema->array()
                ->description('Optional array of command arguments')
                ->items($schema->string()),
        ];
    }
}
