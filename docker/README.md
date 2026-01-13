# Docker Setup for CBT Application

Complete Docker setup using **FrankenPHP** (modern PHP application server) with PostgreSQL and Redis.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB+ available RAM
- Git

## 🚀 Quick Start

### 1. Initial Setup

```bash
# Clone repository (if not already done)
git clone <repository-url>
cd cbt-app-react

# Copy environment file
cp .env.docker .env

# Edit .env file and update:
# - APP_KEY (will be generated later)
# - DB_PASSWORD
# - GEMINI_API_KEY (for AI features)
```

### 2. Using Make Commands (Recommended)

```bash
# Initialize project (first time only)
make init

# Start services
make up

# View logs
make logs

# Stop services
make down
```

### 3. Manual Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Generate app key (first time only)
docker-compose exec app php artisan key:generate

# Run migrations
docker-compose exec app php artisan migrate --seed

# Check status
docker-compose ps
```

## 🛠️ Development Mode

Development mode includes additional tools:
- **Vite Dev Server** (hot reload for frontend)
- **pgAdmin** (PostgreSQL management UI)
- **Redis Commander** (Redis management UI)

```bash
# Start in development mode
make up-dev

# Or manually:
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

**Access Points:**
- Application: http://localhost:8000
- Vite Dev Server: http://localhost:5173
- pgAdmin: http://localhost:5050 (admin@cbt.local / admin)
- Redis Commander: http://localhost:8081

## 📦 Services

| Service | Port | Description |
|---------|------|-------------|
| app | 80, 443 | FrankenPHP application server |
| postgres | 5432 | PostgreSQL 16 database |
| redis | 6379 | Redis cache/session/queue |
| queue | - | Background job worker |
| scheduler | - | Laravel task scheduler |
| vite (dev) | 5173 | Vite development server |
| pgadmin (dev) | 5050 | PostgreSQL admin interface |
| redis-commander (dev) | 8081 | Redis management UI |

## 🔧 Common Commands

### Application Management

```bash
# Access application shell
make shell

# Run artisan commands
docker-compose exec app php artisan <command>

# Clear all caches
make clear

# Optimize for production
make optimize
```

### Database Management

```bash
# Access PostgreSQL
make shell-postgres

# Run migrations
make migrate

# Fresh migration with seeders
make fresh

# Backup database
make backup-db

# Restore database
make restore-db FILE=backup_20260113.sql
```

### Queue & Jobs

```bash
# View queue logs
make logs-queue

# Manually run queue worker
make queue-work
```

### Frontend Development

```bash
# Install NPM dependencies
make npm-install

# Build production assets
make npm-build
```

## 🔍 Debugging

### View Logs

```bash
# All services
make logs

# Specific service
docker-compose logs -f app
docker-compose logs -f queue
docker-compose logs -f postgres
```

### Check Service Health

```bash
# View service status
make status

# Test database connection
docker-compose exec app php artisan db:show

# Test Redis connection
docker-compose exec app php artisan tinker
# Then run: cache()->put('test', 'ok'); cache()->get('test');
```

### Common Issues

**Issue: Port already in use**
```bash
# Check what's using the port
netstat -ano | findstr :80
# Stop Laragon/XAMPP or change ports in docker-compose.yml
```

**Issue: Permission denied on storage**
```bash
docker-compose exec app chmod -R 775 storage bootstrap/cache
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
```

**Issue: Database connection refused**
```bash
# Wait for PostgreSQL to fully start
docker-compose logs postgres
# Restart services
make restart
```

## 🌐 Production Deployment

### 1. Update Environment

```bash
# Edit .env for production
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
```

### 2. Build for Production

```bash
# Build optimized images
docker-compose build --no-cache

# Start services
docker-compose up -d

# Optimize Laravel
make optimize
```

### 3. SSL/HTTPS Setup

FrankenPHP includes automatic HTTPS via Caddy. Update `Caddyfile`:

```caddyfile
yourdomain.com {
    # Your configuration
}
```

## 📊 Performance Tuning

### Scale Queue Workers

```bash
docker-compose up -d --scale queue=3
```

### Adjust FrankenPHP Workers

Edit `.env`:
```bash
FRANKENPHP_WORKERS=4  # Set to number of CPU cores
```

### PostgreSQL Optimization

Edit `docker-compose.yml` under postgres environment:
```yaml
POSTGRES_PARAMETERS: "-c shared_buffers=256MB -c max_connections=200"
```

## 🗑️ Clean Up

```bash
# Stop and remove containers
make down

# Remove everything including volumes
make clean

# Remove all Docker resources
docker system prune -a --volumes
```

## 📚 Additional Resources

- [FrankenPHP Documentation](https://frankenphp.dev/)
- [Laravel Documentation](https://laravel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🆘 Support

For issues related to:
- **Application**: Check Laravel logs in `storage/logs/`
- **Docker**: Run `docker-compose logs`
- **Database**: Access pgAdmin at http://localhost:5050

## 📝 Notes

- Default credentials are in `.env.docker`
- Change all default passwords in production
- Backup your database regularly using `make backup-db`
- Monitor container resource usage with `docker stats`
