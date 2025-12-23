# MCP Server - Aplikasi CBT

Dokumentasi untuk MCP (Model Context Protocol) Server aplikasi CBT yang memungkinkan AI assistants seperti Gemini CLI dan Claude Desktop untuk berinteraksi dengan aplikasi.

## 📋 Daftar Isi

- [Instalasi](#instalasi)
- [Menjalankan Server](#menjalankan-server)
- [Konfigurasi dengan AI Assistants](#konfigurasi-dengan-ai-assistants)
- [Tools](#tools)
- [Resources](#resources)
- [Prompts](#prompts)
- [Troubleshooting](#troubleshooting)

## 🚀 Instalasi

MCP server sudah terinstall sebagai bagian dari aplikasi melalui package `laravel/mcp` v0.3.3.

Tidak ada instalasi tambahan yang diperlukan.

## ▶️ Menjalankan Server

### Local Server (untuk AI Assistants)

Jalankan MCP server dengan command:

```bash
php artisan mcp:start CbtServer
```

Server akan berjalan dan menunggu koneksi dari AI assistant.

### Web Server (HTTP Endpoint)

Untuk mengakses via HTTP (memerlukan authentication):

1. Publish routes:
```bash
php artisan mcp:install --routes
```

2. Configure authentication di `routes/mcp.php`

## 🔧 Konfigurasi dengan AI Assistants

### Gemini CLI

1. Jalankan MCP server:
```bash
php artisan mcp:start CbtServer
```

2. Configure Gemini CLI untuk connect ke server (ikuti dokumentasi Gemini CLI)

### Claude Desktop

1. Edit file konfigurasi Claude Desktop:
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Tambahkan konfigurasi berikut:

```json
{
  "mcpServers": {
    "cbt-application": {
      "command": "php",
      "args": [
        "artisan",
        "mcp:start",
        "CbtServer"
      ],
      "cwd": "E:\\laragon\\www\\cbt-app-react"
    }
  }
}
```

3. Restart Claude Desktop

4. Server akan muncul di sidebar Claude dengan icon 🔌

## 🛠️ Tools

Tools adalah aksi yang dapat dieksekusi oleh AI assistant.

### GetTableSchemaTool

Mendapatkan struktur tabel database.

**Input:**
- `table` (required): Nama tabel database

**Output:** Schema tabel dengan columns, types, indexes, dan foreign keys

**Contoh penggunaan:**
```
"Get schema for users table"
```

### QueryDatabaseTool

Menjalankan SELECT query pada database.

**Input:**
- `query` (required): SQL SELECT statement
- `bindings` (optional): Array parameter bindings

**Output:** Hasil query dalam format JSON

**Security:** Hanya SELECT queries yang diperbolehkan

**Contoh penggunaan:**
```
"Query all students from users table where user_type is student"
```

### GetModelInfoTool

Mendapatkan informasi detail tentang Laravel model.

**Input:**
- `model` (required): Nama model (e.g., "User", "Grade", "Exam")

**Output:** Model structure, fillable, relationships, casts, table name

**Contoh penggunaan:**
```
"Get information about User model"
```

### GetRoutesTool

Mendapatkan daftar routes aplikasi.

**Input:**
- `filter` (optional): Filter routes by URI, name, atau action

**Output:** List routes dengan methods, URIs, names, dan actions

**Contoh penggunaan:**
```
"List all admin routes"
```

### ReadLogsTool

Membaca application logs.

**Input:**
- `lines` (optional, default: 50): Jumlah baris log
- `level` (optional): Filter by log level (ERROR, WARNING, INFO, DEBUG)

**Output:** Latest log entries

**Contoh penggunaan:**
```
"Read last 100 lines of logs"
"Show only ERROR level logs"
```

### RunArtisanTool

Menjalankan safe Artisan commands.

**Input:**
- `command` (required): Artisan command (harus dari whitelist)
- `arguments` (optional): Array command arguments

**Allowed commands:**
- `route:list`
- `migrate:status`
- `config:show`
- `about`
- `db:show`
- `db:table`
- `model:show`
- `schedule:list`
- `event:list`

**Contoh penggunaan:**
```
"Run route:list command"
"Show migration status"
```

## 📚 Resources

Resources menyediakan akses read-only ke berbagai aspek aplikasi.

### models://

List semua models atau view specific model.

**URI:**
- `models://` - List semua models
- `models://User` - View User model source code

**Contoh penggunaan:**
```
"Show me all available models"
"View the User model code"
```

### controllers://

List semua controllers atau view specific controller.

**URI:**
- `controllers://` - List semua controllers
- `controllers://UserController` - View UserController dengan methods

**Contoh penggunaan:**
```
"List all controllers"
"Show UserController methods"
```

### migrations://

List migrations atau view specific migration.

**URI:**
- `migrations://` - List semua migrations
- `migrations://create_users_table` - View migration file

**Contoh penggunaan:**
```
"Show all migrations"
"View users table migration"
```

### database://schema

Overview seluruh database schema.

**URI:** `database://schema`

**Output:** List semua tables dengan column counts dan basic info

**Contoh penggunaan:**
```
"Show database schema overview"
```

## 💡 Prompts

Prompts adalah template untuk common workflows.

### CreateCrudPrompt

Step-by-step guide untuk membuat CRUD resource baru.

**Arguments:**
- `resource_name` (required): Nama resource (e.g., "Teacher", "Classroom")
- `fields` (optional): Deskripsi fields untuk migration

**Output:** Complete guide dari model sampai React views

**Contoh penggunaan:**
```
"Guide me to create a Teacher CRUD resource"
```

### DebugErrorPrompt

Systematic debugging checklist untuk errors.

**Arguments:**
- `error_message` (required): Error message
- `file` (optional): File where error occurred
- `line` (optional): Line number

**Output:** Debugging checklist dan common solutions

**Contoh penggunaan:**
```
"Help me debug: Column not found error"
```

### AnalyzeRelationshipsPrompt

Guide untuk analyze model relationships.

**Arguments:**
- `model_name` (required): Nama model untuk analyze

**Output:** Relationship analysis guide dengan recommended tools

**Contoh penggunaan:**
```
"Analyze relationships for User model"
```

## 🔍 Troubleshooting

### Server tidak start

1. Check PHP version (minimal 8.2)
2. Verify Laravel MCP package terinstall:
   ```bash
   composer show laravel/mcp
   ```
3. Check untuk syntax errors:
   ```bash
   php -l app/Mcp/Servers/CbtServer.php
   ```

### AI Assistant tidak detect server

1. Verify server running
2. Check konfigurasi file path correct
3. Restart AI assistant
4. Check logs untuk connection errors

### Tool execution errors

1. Check database connection di `.env`
2. Verify permissions untuk file/directory access
3. Check logs dengan `ReadLogsTool`

## 📖 Contoh Workflow

### 1. Debugging Error

```
User: "I'm getting a column not found error for academic_year_id"

AI uses:
1. ReadLogsTool - Check recent errors
2. GetTableSchemaTool - Verify table structure
3. GetModelInfoTool - Check model fillable
4. DebugErrorPrompt - Get debugging checklist
```

### 2. Creating New Feature

```
User: "I want to create a Teacher management feature"

AI uses:
1. CreateCrudPrompt - Get step-by-step guide
2. models:// - Check existing models for reference
3. GetTableSchemaTool - Verify related tables
4. GetRoutesTool - Check available route patterns
```

### 3. Analyzing Relationships

```
User: "Show me all relationships for the Grade model"

AI uses:
1. GetModelInfoTool - Get Grade model info
2. AnalyzeRelationshipsPrompt - Get analysis guide
3. GetTableSchemaTool - Verify pivot tables
4. QueryDatabaseTool - Test relationship data
```

## 🎯 Best Practices

1. **Always use tools** - Jangan assume, gunakan tools untuk verify
2. **Check logs first** - Saat debugging, mulai dengan ReadLogsTool
3. **Verify schema** - Sebelum query, check schema dengan GetTableSchemaTool
4. **Use prompts** - Untuk workflow kompleks, gunakan prompts sebagai guide
5. **Test queries** - Gunakan QueryDatabaseTool untuk test sebelum implement

## 📝 Notes

- MCP server berjalan dalam mode stdio untuk local AI assistants
- Semua database operations read-only kecuali melalui application logic
- Tools memiliki built-in security validation
- Resources provide read-only access ke codebase
