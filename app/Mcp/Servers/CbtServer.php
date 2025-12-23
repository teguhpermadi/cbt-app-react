<?php

namespace App\Mcp\Servers;

use Laravel\Mcp\Server;

class CbtServer extends Server
{
    /**
     * The MCP server's name.
     */
    protected string $name = 'CBT Application Server';

    /**
     * The MCP server's version.
     */
    protected string $version = '1.0.0';

    /**
     * The MCP server's instructions for the LLM.
     */
    protected string $instructions = <<<'MARKDOWN'
        # CBT Application MCP Server
        
        This server provides access to a Computer-Based Test (CBT) application built with Laravel, Inertia.js, and React.
        
        ## Available Capabilities
        
        ### Tools
        - **Database Operations**: Query database tables, get schema information
        - **Model Information**: Inspect Laravel models, relationships, and attributes
        - **Routes**: List and filter application routes
        - **Artisan Commands**: Execute safe artisan commands
        - **Logs**: Read and filter application logs
        
        ### Resources
        - **Models**: Access information about all application models (User, Grade, Subject, Exam, etc.)
        - **Controllers**: Browse controller structure and methods
        - **Migrations**: View migration files and database schema
        - **Database Schema**: Get overview of database structure
        
        ### Prompts
        - **CRUD Creation**: Step-by-step guide for creating new resources
        - **Debugging**: Systematic approach to debug errors
        - **Relationship Analysis**: Analyze and verify model relationships
        
        ## Application Context
        
        This is a CBT (Computer-Based Test) application with the following main features:
        - User management (students, teachers, admins)
        - Grade and subject management
        - Question banks and exam creation
        - Exam sessions and result tracking
        - Academic year management
        
        The application uses:
        - Laravel 12 with Inertia.js
        - React 19 for frontend
        - MySQL database
        - Spatie packages for permissions and activity logging
    MARKDOWN;

    /**
     * The tools registered with this MCP server.
     *
     * @var array<int, class-string<\Laravel\Mcp\Server\Tool>>
     */
    protected array $tools = [
        \App\Mcp\Tools\GetTableSchemaTool::class,
        \App\Mcp\Tools\QueryDatabaseTool::class,
        \App\Mcp\Tools\GetModelInfoTool::class,
        \App\Mcp\Tools\GetRoutesTool::class,
        \App\Mcp\Tools\ReadLogsTool::class,
        \App\Mcp\Tools\RunArtisanTool::class,
    ];

    /**
     * The resources registered with this MCP server.
     *
     * @var array<int, class-string<\Laravel\Mcp\Server\Resource>>
     */
    protected array $resources = [
        \App\Mcp\Resources\ModelsResource::class,
        \App\Mcp\Resources\ControllersResource::class,
        \App\Mcp\Resources\MigrationsResource::class,
        \App\Mcp\Resources\DatabaseSchemaResource::class,
    ];

    /**
     * The prompts registered with this MCP server.
     *
     * @var array<int, class-string<\Laravel\Mcp\Server\Prompt>>
     */
    protected array $prompts = [
        \App\Mcp\Prompts\CreateCrudPrompt::class,
        \App\Mcp\Prompts\DebugErrorPrompt::class,
        \App\Mcp\Prompts\AnalyzeRelationshipsPrompt::class,
    ];
}
