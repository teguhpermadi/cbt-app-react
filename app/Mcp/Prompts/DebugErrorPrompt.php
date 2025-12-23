<?php

namespace App\Mcp\Prompts;

use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Prompt;
use Laravel\Mcp\Server\Prompts\Argument;

class DebugErrorPrompt extends Prompt
{
    /**
     * The prompt's description.
     */
    protected string $description = <<<'MARKDOWN'
        Provides a systematic debugging checklist and common solutions for errors in the CBT application.
    MARKDOWN;

    /**
     * Handle the prompt request.
     */
    public function handle(Request $request): Response
    {
        $errorMessage = $request->input('error_message');
        $file = $request->input('file', 'unknown');
        $line = $request->input('line', 'unknown');

        $guide = <<<GUIDE
# Debugging Error

**Error**: {$errorMessage}
**File**: {$file}
**Line**: {$line}

## Debugging Checklist

### 1. Check Application Logs
Use `ReadLogsTool` to read recent log entries:
- Look for stack traces
- Check for related errors
- Note timestamps

### 2. Verify Database Connection
- Check `.env` database credentials
- Use `QueryDatabaseTool` to test connection
- Verify table exists with `GetTableSchemaTool`

### 3. Check Model Configuration
Use `GetModelInfoTool` to verify:
- Fillable attributes are correct
- Relationships are properly defined
- Casts are configured
- Table name is correct

### 4. Verify Routes
Use `GetRoutesTool` to check:
- Route is registered
- Route name matches
- Middleware is correct
- Controller method exists

### 5. Check Frontend (Inertia/React)
- Verify prop names match backend
- Check for null/undefined values
- Ensure optional chaining (?.) is used
- Verify Wayfinder URL helpers usage

## Common Error Patterns

### "Column not found"
- Run `GetTableSchemaTool` to verify column exists
- Check model's `\$fillable` array
- Verify migration ran successfully

### "Class not found"
- Check namespace and use statements
- Run `composer dump-autoload`
- Verify file location matches namespace

### "Undefined property"
- Use `GetModelInfoTool` to check relationships
- Verify eager loading in controller
- Check for typos in property names

### "Route not found"
- Use `GetRoutesTool` to list all routes
- Verify route name in Wayfinder call
- Check route parameters

## Recommended Tools

1. `ReadLogsTool` - Read application logs
2. `GetModelInfoTool` - Inspect model structure
3. `GetTableSchemaTool` - Check database schema
4. `QueryDatabaseTool` - Test database queries
5. `GetRoutesTool` - Verify routing

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
                name: 'error_message',
                description: 'The error message to debug',
                required: true
            ),
            new Argument(
                name: 'file',
                description: 'The file where the error occurred',
                required: false
            ),
            new Argument(
                name: 'line',
                description: 'The line number where the error occurred',
                required: false
            ),
        ];
    }
}
