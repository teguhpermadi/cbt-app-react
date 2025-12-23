<?php

namespace App\Mcp\Prompts;

use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Prompt;
use Laravel\Mcp\Server\Prompts\Argument;

class CreateCrudPrompt extends Prompt
{
    /**
     * The prompt's description.
     */
    protected string $description = <<<'MARKDOWN'
        Provides a step-by-step guide for creating a new CRUD resource in the CBT application.
        
        This includes creating model, migration, controller, routes, and Inertia React views.
    MARKDOWN;

    /**
     * Handle the prompt request.
     */
    public function handle(Request $request): Response
    {
        $resourceName = $request->input('resource_name');
        $fields = $request->input('fields', '');

        $guide = <<<GUIDE
# Creating CRUD Resource: {$resourceName}

## Step 1: Create Model and Migration

```bash
php artisan make:model {$resourceName} -m
```

Edit the migration file in `database/migrations/` to add fields:
{$fields}

## Step 2: Run Migration

```bash
php artisan migrate
```

## Step 3: Update Model

Edit `app/Models/{$resourceName}.php`:
- Add fillable attributes
- Define relationships if needed
- Add casts for date/boolean fields

## Step 4: Create Controller

```bash
php artisan make:controller Admin/{$resourceName}Controller --resource
```

Implement CRUD methods:
- `index()` - List with pagination
- `store()` - Create new record
- `update()` - Update existing record
- `destroy()` - Delete record

## Step 5: Add Routes

Edit `routes/web.php`:

```php
Route::resource('{resource_name_plural}', App\\Http\\Controllers\\Admin\\{$resourceName}Controller::class);
```

## Step 6: Create React Views

Create `resources/js/pages/admin/{resource_name_plural}/index.tsx`:
- Table to display records
- Modal for create/edit forms
- Delete confirmation
- Pagination

## Step 7: Add Navigation

Edit sidebar navigation to include link to new resource.

## Tools to Use

- `GetModelInfoTool` - Check model structure
- `GetRoutesTool` - Verify routes registered
- `QueryDatabaseTool` - Test data queries
- `GetTableSchemaTool` - Verify migration schema

GUIDE;

        return Response::text($guide);
    }

    /**
     * Get the prompt's arguments.
     *
     * @return array<int, \Laravel\Mcp\Server\Prompts\Argument>
     */
    public function arguments(): array
    {
        return [
            new Argument(
                name: 'resource_name',
                description: 'The name of the resource to create (e.g., "Teacher", "Classroom")',
                required: true
            ),
            new Argument(
                name: 'fields',
                description: 'Optional description of fields for the migration',
                required: false
            ),
        ];
    }
}
