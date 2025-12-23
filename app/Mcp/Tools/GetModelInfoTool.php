<?php

namespace App\Mcp\Tools;

use Illuminate\Database\Eloquent\Model;
use Illuminate\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use ReflectionClass;
use ReflectionMethod;

class GetModelInfoTool extends Tool
{
    /**
     * The tool's description.
     */
    protected string $description = <<<'MARKDOWN'
        Get detailed information about a Laravel Eloquent model including its attributes, relationships, casts, and table name.
        
        This tool is useful for:
        - Understanding model structure
        - Viewing model relationships (hasMany, belongsTo, etc.)
        - Checking fillable and guarded attributes
        - Inspecting model casts and accessors
    MARKDOWN;

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $modelName = $request->input('model');

        // Try to find the model class
        $modelClass = "App\\Models\\{$modelName}";

        if (!class_exists($modelClass)) {
            return Response::text("Model '{$modelName}' not found. Make sure the model exists in App\\Models namespace.");
        }

        try {
            $reflection = new ReflectionClass($modelClass);

            if (!$reflection->isSubclassOf(Model::class)) {
                return Response::text("Class '{$modelName}' is not an Eloquent model.");
            }

            $model = new $modelClass;

            // Get relationships by analyzing public methods
            $relationships = [];
            $methods = $reflection->getMethods(ReflectionMethod::IS_PUBLIC);

            foreach ($methods as $method) {
                if ($method->class !== $modelClass || $method->getNumberOfParameters() > 0) {
                    continue;
                }

                try {
                    $return = $method->invoke($model);
                    if ($return instanceof \Illuminate\Database\Eloquent\Relations\Relation) {
                        $relationships[$method->name] = [
                            'type' => class_basename(get_class($return)),
                            'related' => get_class($return->getRelated()),
                        ];
                    }
                } catch (\Throwable $e) {
                    // Skip methods that throw errors
                    continue;
                }
            }

            $info = [
                'model' => $modelName,
                'class' => $modelClass,
                'table' => $model->getTable(),
                'primary_key' => $model->getKeyName(),
                'fillable' => $model->getFillable(),
                'guarded' => $model->getGuarded(),
                'casts' => $model->getCasts(),
                'dates' => method_exists($model, 'getDates') ? $model->getDates() : [],
                'timestamps' => $model->timestamps,
                'relationships' => $relationships,
            ];

            return Response::text(json_encode($info, JSON_PRETTY_PRINT));
        } catch (\Exception $e) {
            return Response::text("Error analyzing model: " . $e->getMessage());
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
            'model' => $schema->string()
                ->description('The name of the model to inspect (e.g., "User", "Grade", "Exam")')
                ->required(),
        ];
    }
}
