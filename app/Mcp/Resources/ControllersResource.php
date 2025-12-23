<?php

namespace App\Mcp\Resources;

use Illuminate\Support\Facades\File;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Resource;
use ReflectionClass;
use ReflectionMethod;

class ControllersResource extends Resource
{
    /**
     * The resource URI template.
     */
    protected string $uri = 'controllers://{controller?}';

    /**
     * The resource's name.
     */
    protected string $name = 'Controllers';

    /**
     * The resource's description.
     */
    protected string $description = <<<'MARKDOWN'
        Access information about Laravel controllers in the application.
        
        - Without parameter: Returns list of all available controllers
        - With controller name: Returns methods and source code of the specified controller
    MARKDOWN;

    /**
     * Handle the resource request.
     */
    public function handle(Request $request): Response
    {
        $controllerName = $request->uri->controller ?? null;
        $controllersPath = app_path('Http/Controllers');

        if (!$controllerName) {
            // List all controllers recursively
            $controllers = $this->getControllersRecursively($controllersPath);

            return Response::text(json_encode([
                'total' => count($controllers),
                'controllers' => $controllers,
            ], JSON_PRETTY_PRINT));
        }

        // Get specific controller
        $controllerPath = $this->findControllerPath($controllersPath, $controllerName);

        if (!$controllerPath) {
            return Response::text("Controller '{$controllerName}' not found.");
        }

        // Get controller methods using reflection
        $namespace = $this->getNamespaceFromFile($controllerPath);
        $className = $namespace . '\\' . pathinfo($controllerPath, PATHINFO_FILENAME);

        if (!class_exists($className)) {
            return Response::text(File::get($controllerPath));
        }

        $reflection = new ReflectionClass($className);
        $methods = collect($reflection->getMethods(ReflectionMethod::IS_PUBLIC))
            ->filter(fn($method) => $method->class === $className)
            ->map(fn($method) => [
                'name' => $method->name,
                'parameters' => collect($method->getParameters())->map(fn($param) => [
                    'name' => $param->name,
                    'type' => $param->getType() ? $param->getType()->getName() : 'mixed',
                ])->all(),
            ])
            ->values()
            ->all();

        $content = File::get($controllerPath);

        return Response::text(json_encode([
            'controller' => $controllerName,
            'class' => $className,
            'methods' => $methods,
            'source' => $content,
        ], JSON_PRETTY_PRINT));
    }

    /**
     * Get all controllers recursively
     */
    protected function getControllersRecursively(string $path, string $prefix = ''): array
    {
        $controllers = [];

        foreach (File::allFiles($path) as $file) {
            if ($file->getExtension() === 'php') {
                $relativePath = str_replace($path . DIRECTORY_SEPARATOR, '', $file->getPathname());
                $relativePath = str_replace(DIRECTORY_SEPARATOR, '/', $relativePath);
                $relativePath = str_replace('.php', '', $relativePath);

                $controllers[] = [
                    'name' => $file->getFilenameWithoutExtension(),
                    'path' => $relativePath,
                    'full_path' => $file->getPathname(),
                ];
            }
        }

        return $controllers;
    }

    /**
     * Find controller path by name
     */
    protected function findControllerPath(string $basePath, string $controllerName): ?string
    {
        foreach (File::allFiles($basePath) as $file) {
            if ($file->getFilenameWithoutExtension() === $controllerName) {
                return $file->getPathname();
            }
        }

        return null;
    }

    /**
     * Get namespace from file
     */
    protected function getNamespaceFromFile(string $filePath): string
    {
        $content = File::get($filePath);

        if (preg_match('/namespace\s+(.+?);/', $content, $matches)) {
            return $matches[1];
        }

        return 'App\\Http\\Controllers';
    }
}
