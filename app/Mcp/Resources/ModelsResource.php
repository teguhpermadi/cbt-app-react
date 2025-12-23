<?php

namespace App\Mcp\Resources;

use Illuminate\Support\Facades\File;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Resource;

class ModelsResource extends Resource
{
    /**
     * The resource URI template.
     */
    protected string $uri = 'models://{model?}';

    /**
     * The resource's name.
     */
    protected string $name = 'Models';

    /**
     * The resource's description.
     */
    protected string $description = <<<'MARKDOWN'
        Access information about Laravel Eloquent models in the application.
        
        - Without parameter: Returns list of all available models
        - With model name: Returns the source code of the specified model
    MARKDOWN;

    /**
     * Handle the resource request.
     */
    public function handle(Request $request): Response
    {
        $modelName = $request->uri->model ?? null;
        $modelsPath = app_path('Models');

        if (!$modelName) {
            // List all models
            $models = collect(File::files($modelsPath))
                ->map(function ($file) {
                    return [
                        'name' => $file->getFilenameWithoutExtension(),
                        'path' => $file->getPathname(),
                        'size' => $file->getSize(),
                    ];
                })
                ->values()
                ->all();

            return Response::text(json_encode([
                'total' => count($models),
                'models' => $models,
            ], JSON_PRETTY_PRINT));
        }

        // Get specific model content
        $modelPath = $modelsPath . '/' . $modelName . '.php';

        if (!File::exists($modelPath)) {
            return Response::text("Model '{$modelName}' not found.");
        }

        $content = File::get($modelPath);

        return Response::text($content);
    }
}
