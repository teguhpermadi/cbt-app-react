<?php

namespace App\Mcp\Tools;

use Illuminate\JsonSchema\JsonSchema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;

class GetTableSchemaTool extends Tool
{
    /**
     * The tool's description.
     */
    protected string $description = <<<'MARKDOWN'
        Get the schema information for a database table including columns, types, indexes, and foreign keys.
        
        This tool is useful for:
        - Understanding table structure
        - Checking column types and constraints
        - Viewing indexes and foreign key relationships
        - Database schema exploration
    MARKDOWN;

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $table = $request->input('table');

        if (!Schema::hasTable($table)) {
            return Response::text("Table '{$table}' does not exist.");
        }

        $columns = Schema::getColumns($table);
        $indexes = Schema::getIndexes($table);
        $foreignKeys = Schema::getForeignKeys($table);

        $schema = [
            'table' => $table,
            'columns' => array_map(function ($column) {
                return [
                    'name' => $column['name'],
                    'type' => $column['type_name'],
                    'nullable' => $column['nullable'],
                    'default' => $column['default'],
                    'auto_increment' => $column['auto_increment'],
                ];
            }, $columns),
            'indexes' => array_map(function ($index) {
                return [
                    'name' => $index['name'],
                    'columns' => $index['columns'],
                    'type' => $index['type'],
                    'unique' => $index['unique'],
                    'primary' => $index['primary'],
                ];
            }, $indexes),
            'foreign_keys' => array_map(function ($fk) {
                return [
                    'columns' => $fk['columns'],
                    'foreign_table' => $fk['foreign_table'],
                    'foreign_columns' => $fk['foreign_columns'],
                    'on_update' => $fk['on_update'],
                    'on_delete' => $fk['on_delete'],
                ];
            }, $foreignKeys),
        ];

        return Response::text(json_encode($schema, JSON_PRETTY_PRINT));
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, \Illuminate\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'table' => $schema->string()
                ->description('The name of the database table to inspect')
                ->required(),
        ];
    }
}
