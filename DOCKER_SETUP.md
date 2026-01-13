# Setup Instructions for Docker

## Issue Fixed
✅ Updated Makefile to use `docker compose` (v2) instead of `docker-compose` (v1)

## Current Issue
❌ Docker is not installed or not in PATH

## Solution

### Option 1: Install Docker Desktop (Recommended)

1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Install and restart your computer
3. Launch Docker Desktop and wait until status shows "Running"
4. Verify installation:
   ```powershell
   docker --version
   docker compose version
   ```

### Option 2: Using Docker in Laragon

If you have Docker installed but it's not in PATH:

1. Find where Docker is installed (common locations):
   - `C:\Program Files\Docker\Docker\resources\bin`
   - `C:\ProgramData\DockerDesktop\version-bin`

2. Add to PATH:
   - Press Win + X → System
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path" → Edit
   - Add the Docker bin directory
   - Click OK and restart terminal

### After Docker is Running

1. Copy environment file:
   ```powershell
   cp .env.docker .env
   ```

2. Edit `.env` file and update:
   - `APP_KEY` (leave empty, will be generated)
   - `DB_PASSWORD` (change from "secret" to something secure)
   - `GEMINI_API_KEY` (your API key for AI features)

3. Run initialization:
   ```powershell
   make init
   ```

4. Access application at http://localhost

## Alternative: Manual Commands

If you prefer not to use Makefile:

```powershell
# Copy environment
cp .env.docker .env

# Build images
docker compose build

# Start services
docker compose up -d

# Wait 10 seconds for services to start
timeout /t 10

# Generate app key
docker compose exec app php artisan key:generate

# Run migrations
docker compose exec app php artisan migrate --force

# Check status
docker compose ps
```

## Development Mode

To start with development tools (Vite, pgAdmin, Redis Commander):

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

Access points:
- App: http://localhost:8000
- Vite: http://localhost:5173
- pgAdmin: http://localhost:5050 (admin@cbt.local / admin)
- Redis Commander: http://localhost:8081

## Troubleshooting

### Port Already in Use
If port 80 is already used by Laragon/XAMPP:

1. Stop Laragon/XAMPP services
2. Or edit `docker-compose.yml` to use different port:
   ```yaml
   ports:
     - "8000:80"  # Change 80 to 8000
   ```

### Permission Errors
Run PowerShell as Administrator

### Services Not Starting
```powershell
# Check logs
docker compose logs

# Restart services
docker compose restart
```
