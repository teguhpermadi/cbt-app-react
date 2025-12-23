<?php

namespace App\Mcp\Resources;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Resource;

class DatabaseSchemaResource extends Resource
{
    /**
     * The resource URI.
     */
    protected string $uri = 'database://schema';

    /**
     * The resource's name.
     */
    protected string $name = 'Database Schema';

    /**
     * The resource's description.
     */
    protected string $description = <<<'MARKDOWN'
        Get an overview of the entire database schema including all tables and their basic information.
        
        This provides a high-level view of the database structure.
    MARKDOWN;

    /**
     * Handle the resource request.
     */
    public function handle(Request $request): Response
    {
        $tables = Schema::getTables();

        $schemaInfo = collect($tables)->map(function ($table) {
            $tableName = $table['name'];
            $columns = Schema::getColumns($tableName);
            $indexes = Schema::getIndexes($tableName);
            $foreignKeys = Schema::getForeignKeys($tableName);

            return [
                'name' => $tableName,
                'columns_count' => count($columns),
                'indexes_count' => count($indexes),
                'foreign_keys_count' => count($foreignKeys),
                'columns' => array_map(fn($col) => [
                    'name' => $col['name'],
                    'type' => $col['type_name'],
                    'nullable' => $col['nullable'],
                ], $columns),
            ];
        })->values()->all();

        $output = [
            'database' => DB::getDatabaseName(),
            'total_tables' => count($tables),
            'tables' => $schemaInfo,
        ];

        return Response::text(json_encode($output, JSON_PRETTY_PRINT));
    }
}
