<?php

namespace App\Mcp\Prompts;

use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Prompt;
use Laravel\Mcp\Server\Prompts\Argument;

class AnalyzeRelationshipsPrompt extends Prompt
{
    /**
     * The prompt's description.
     */
    protected string $description = <<<'MARKDOWN'
        Provides a guide for analyzing and verifying Laravel model relationships.
    MARKDOWN;

    /**
     * Handle the prompt request.
     */
    public function handle(Request $request): Response
    {
        $modelName = $request->input('model_name');

        $guide = <<<GUIDE
# Analyzing Relationships for Model: {$modelName}

## Step 1: Get Model Information

Use `GetModelInfoTool` with model name "{$modelName}" to see:
- All defined relationships
- Relationship types (hasMany, belongsTo, belongsToMany, etc.)
- Related models

## Step 2: Verify Database Schema

For each relationship, verify the database structure:

### One-to-Many / Many-to-One
- Use `GetTableSchemaTool` to check foreign key columns
- Verify foreign key constraints exist
- Check column types match

### Many-to-Many
- Check pivot table exists
- Verify pivot table has both foreign keys
- Check for additional pivot columns (timestamps, etc.)

## Step 3: Test Relationships with Queries

Use `QueryDatabaseTool` to test:

```sql
-- Check if foreign keys have valid references
SELECT * FROM {table} WHERE {foreign_key}_id NOT IN (SELECT id FROM {related_table});

-- Check pivot table data
SELECT * FROM {pivot_table} LIMIT 10;
```

## Step 4: Common Relationship Issues

### Issue: "Call to undefined relationship"
- Verify relationship method exists in model
- Check method name matches usage
- Use `GetModelInfoTool` to list all relationships

### Issue: "Relationship returns null"
- Check foreign key values in database
- Verify related records exist
- Check for soft deletes

### Issue: "Pivot table not found"
- Verify pivot table name follows convention
- Check if custom pivot table name is specified
- Use `GetTableSchemaTool` to verify table exists

## Relationship Types in CBT Application

### User Relationships
- `grades()` - belongsToMany with Grade (pivot: grade_user)
- `roles()` - belongsToMany with Role (Spatie)
- `permissions()` - belongsToMany with Permission (Spatie)

### Grade Relationships
- `students()` - belongsToMany with User
- `subjects()` - hasMany Subject
- `academicYear()` - belongsTo AcademicYear

### Exam Relationships
- `subject()` - belongsTo Subject
- `grade()` - belongsTo Grade
- `questionBank()` - belongsTo QuestionBank
- `examQuestions()` - hasMany ExamQuestion
- `examSessions()` - hasMany ExamSession

## Recommended Tools

1. `GetModelInfoTool` - Get model relationships
2. `GetTableSchemaTool` - Verify database structure
3. `QueryDatabaseTool` - Test relationship data
4. `models://` resource - View model source code

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
                name: 'model_name',
                description: 'The name of the model to analyze relationships for',
                required: true
            ),
        ];
    }
}
