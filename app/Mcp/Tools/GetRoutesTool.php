<?php

namespace App\Mcp\Tools;

use Illuminate\JsonSchema\JsonSchema;
use Illuminate\Support\Facades\Route;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;

class GetRoutesTool extends Tool
{
    /**
     * The tool's description.
     */
    protected string $description = <<<'MARKDOWN'
        Get a list of all registered routes in the application with optional filtering.
        
        This tool is useful for:
        - Viewing all available routes
        - Finding routes by name or URI pattern
        - Checking route middleware and methods
        - Understanding application routing structure
    MARKDOWN;

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $filter = $request->input('filter', '');

        $routes = collect(Route::getRoutes())->map(function ($route) {
            return [
                'method' => implode('|', $route->methods()),
                'uri' => $route->uri(),
                'name' => $route->getName(),
                'action' => $route->getActionName(),
                'middleware' => $route->middleware(),
            ];
        });

        // Apply filter if provided
        if ($filter) {
            $routes = $routes->filter(function ($route) use ($filter) {
                return str_contains($route['uri'], $filter) ||
                    str_contains($route['name'] ?? '', $filter) ||
                    str_contains($route['action'], $filter);
            });
        }

        $output = [
            'total_routes' => $routes->count(),
            'filter' => $filter ?: 'none',
            'routes' => $routes->values()->all(),
        ];

        return Response::text(json_encode($output, JSON_PRETTY_PRINT));
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, \Illuminate\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'filter' => $schema->string()
                ->description('Optional filter to search routes by URI, name, or action (e.g., "admin", "api", "user")'),
        ];
    }
}
