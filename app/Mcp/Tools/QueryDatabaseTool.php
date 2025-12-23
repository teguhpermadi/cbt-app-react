<?php

namespace App\Mcp\Tools;

use Illuminate\JsonSchema\JsonSchema;
use Illuminate\Support\Facades\DB;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;

class QueryDatabaseTool extends Tool
{
    /**
     * The tool's description.
     */
    protected string $description = <<<'MARKDOWN'
        Execute a SELECT query on the database and return the results.
        
        **Security**: Only SELECT queries are allowed. Any other SQL statements will be rejected.
        
        This tool is useful for:
        - Querying data from tables
        - Analyzing database content
        - Debugging data issues
        - Exploring relationships between tables
    MARKDOWN;

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $query = trim($request->input('query'));
        $bindings = $request->input('bindings', []);

        // Security: Only allow SELECT queries
        if (!preg_match('/^\s*SELECT\s+/i', $query)) {
            return Response::text('Error: Only SELECT queries are allowed for security reasons.');
        }

        // Check for dangerous keywords
        $dangerousKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'TRUNCATE', 'ALTER', 'CREATE'];
        foreach ($dangerousKeywords as $keyword) {
            if (stripos($query, $keyword) !== false) {
                return Response::text("Error: Query contains forbidden keyword: {$keyword}");
            }
        }

        try {
            $results = DB::select($query, $bindings);

            $output = [
                'query' => $query,
                'row_count' => count($results),
                'results' => $results,
            ];

            return Response::text(json_encode($output, JSON_PRETTY_PRINT));
        } catch (\Exception $e) {
            return Response::text("Error executing query: " . $e->getMessage());
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
            'query' => $schema->string()
                ->description('The SELECT SQL query to execute')
                ->required(),
            'bindings' => $schema->array()
                ->description('Optional array of parameter bindings for the query'),
        ];
    }
}
