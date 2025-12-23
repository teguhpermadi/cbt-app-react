<?php

namespace App\Mcp\Resources;

use Illuminate\Support\Facades\File;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Resource;

class MigrationsResource extends Resource
{
    /**
     * The resource URI template.
     */
    protected string $uri = 'migrations://{migration?}';

    /**
     * The resource's name.
     */
    protected string $name = 'Migrations';

    /**
     * The resource's description.
     */
    protected string $description = <<<'MARKDOWN'
        Access database migration files.
        
        - Without parameter: Returns list of all migration files
        - With migration name: Returns the source code of the specified migration
    MARKDOWN;

    /**
     * Handle the resource request.
     */
    public function handle(Request $request): Response
    {
        $migrationName = $request->uri->migration ?? null;
        $migrationsPath = database_path('migrations');

        if (!$migrationName) {
            // List all migrations
            $migrations = collect(File::files($migrationsPath))
                ->map(function ($file) {
                    return [
                        'name' => $file->getFilenameWithoutExtension(),
                        'filename' => $file->getFilename(),
                        'path' => $file->getPathname(),
                        'size' => $file->getSize(),
                        'modified' => date('Y-m-d H:i:s', $file->getMTime()),
                    ];
                })
                ->sortBy('filename')
                ->values()
                ->all();

            return Response::text(json_encode([
                'total' => count($migrations),
                'migrations' => $migrations,
            ], JSON_PRETTY_PRINT));
        }

        // Get specific migration content
        // Try to find migration file (with or without timestamp prefix)
        $migrationFiles = File::files($migrationsPath);
        $migrationPath = null;

        foreach ($migrationFiles as $file) {
            if (
                $file->getFilenameWithoutExtension() === $migrationName ||
                str_contains($file->getFilename(), $migrationName)
            ) {
                $migrationPath = $file->getPathname();
                break;
            }
        }

        if (!$migrationPath) {
            return Response::text("Migration '{$migrationName}' not found.");
        }

        $content = File::get($migrationPath);

        return Response::text($content);
    }
}
