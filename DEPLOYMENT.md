# Panduan Deployment Docker di Ubuntu VPS

Panduan lengkap step-by-step untuk deploy aplikasi CBT di Ubuntu VPS menggunakan Docker.

## ✅ Prerequisites

- Ubuntu 20.04+ (sudah ready)
- Repository sudah di-clone (sudah ready)
- Akses root atau sudo
- Domain (opsional, untuk SSL)

---

## 📋 Step-by-Step Installation

### Step 1: Update System

```bash
# Update package list
sudo apt update

# Upgrade packages (sudah dilakukan)
sudo apt upgrade -y
```

### Step 2: Install Docker

```bash
# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package list again
sudo apt update

# Install Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### Step 3: Setup Docker Permissions (Optional but Recommended)

```bash
# Add your user to docker group (replace 'username' with your actual username)
sudo usermod -aG docker $USER

# Activate the changes
newgrp docker

# Test without sudo
docker ps
```

### Step 4: Navigate to Project Directory

```bash
# Go to your cloned repository
cd /path/to/cbt-app-react

# Verify you're in the right directory
ls -la
# You should see: Dockerfile, docker-compose.yml, etc.
```

### Step 5: Setup Environment File

```bash
# Copy environment template
cp .env.docker .env

# Edit environment file
nano .env
```

**Update these variables:**
```env
APP_NAME="CBT Application"
APP_ENV=production
APP_DEBUG=false
APP_URL=http://your-domain.com  # or http://your-vps-ip

# Database
DB_PASSWORD=YourSecurePassword123  # CHANGE THIS!

# Gemini API (for AI features)
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

### Step 6: Generate Application Key

We need to generate APP_KEY before building:

```bash
# Temporary method to generate key
# We'll do this properly after containers are running
```

### Step 7: Build Docker Images

```bash
# Build all images (this will take 5-10 minutes)
docker compose build

# Check if build succeeded
docker images
```

You should see images like:
- cbt-app-react-app
- postgres:16-alpine
- redis:7-alpine

### Step 8: Start Services

```bash
# Start all containers in background
docker compose up -d

# Check if all services are running
docker compose ps
```

All services should show status "Up" or "Running":
- cbt-app
- cbt-postgres
- cbt-redis
- cbt-queue
- cbt-scheduler

### Step 9: Generate APP_KEY & Run Migrations

```bash
# Generate application key
docker compose exec app php artisan key:generate

# Run database migrations
docker compose exec app php artisan migrate --force

# (Optional) Seed database with sample data
docker compose exec app php artisan db:seed --force
```

### Step 10: Optimize for Production

```bash
# Cache configuration
docker compose exec app php artisan config:cache

# Cache routes
docker compose exec app php artisan route:cache

# Cache views
docker compose exec app php artisan view:cache
```

### Step 11: Setup Firewall

```bash
# Allow SSH (IMPORTANT: do this first!)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS (for SSL later)
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Step 12: Test Application

```bash
# Get your VPS IP address
curl ifconfig.me

# Or
ip addr show
```

Open browser and go to: `http://YOUR_VPS_IP`

You should see your CBT application! 🎉

---

## 🔧 Useful Commands

### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f postgres
docker compose logs -f queue
```

Press `Ctrl+C` to exit logs.

### Managing Services

```bash
# Stop all services
docker compose down

# Restart all services
docker compose restart

# Restart specific service
docker compose restart app

# Check status
docker compose ps
```

### Database Management

```bash
# Access PostgreSQL
docker compose exec postgres psql -U postgres -d cbt_app

# Run migrations
docker compose exec app php artisan migrate

# Fresh migration (WARNING: deletes all data)
docker compose exec app php artisan migrate:fresh --seed
```

### Application Maintenance

```bash
# Clear all caches
docker compose exec app php artisan cache:clear
docker compose exec app php artisan config:clear
docker compose exec app php artisan route:clear
docker compose exec app php artisan view:clear

# Access container shell
docker compose exec app sh

# Run artisan commands
docker compose exec app php artisan [command]
```

---

## 🌐 Setup Domain & SSL (Optional)

### If you have a domain name:

#### 1. Point Domain to VPS

In your domain registrar (Namecheap, GoDaddy, etc.):
- Add A Record: `@` → Your VPS IP
- Add A Record: `www` → Your VPS IP

Wait 5-60 minutes for DNS propagation.

#### 2. Update Caddyfile for Auto SSL

Edit `Caddyfile`:

```bash
nano Caddyfile
```

Change first line from `{$APP_URL:localhost}` to your domain:

```caddyfile
your-domain.com, www.your-domain.com {
    # ... rest of config stays the same
}
```

Update `.env`:
```env
APP_URL=https://your-domain.com
```

#### 3. Restart Services

```bash
docker compose restart app
```

FrankenPHP will automatically get SSL certificate from Let's Encrypt! 🔒

---

## 📊 Monitoring

### Check resource usage

```bash
# See Docker stats (CPU, RAM, etc.)
docker stats

# See disk usage
df -h

# See Docker disk usage
docker system df
```

### Check application status

```bash
# Application health
docker compose exec app php artisan about

# Queue status
docker compose exec app php artisan queue:monitor

# Check logs
docker compose logs -f app
```

---

## 🔄 Updating Application

When you need to update code:

```bash
# Pull latest code
git pull origin main

# Rebuild containers (if Dockerfile changed)
docker compose build

# Restart services
docker compose up -d

# Run new migrations
docker compose exec app php artisan migrate --force

# Re-optimize
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache
```

---

## 💾 Backup

### Backup Database

```bash
# Create backup
docker compose exec postgres pg_dump -U postgres cbt_app > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker compose exec -T postgres psql -U postgres -d cbt_app < backup_20260113.sql
```

### Backup Uploaded Files

```bash
# Backup storage folder
tar -czf storage_backup_$(date +%Y%m%d).tar.gz storage/

# Restore
tar -xzf storage_backup_20260113.tar.gz
```

---

## 🆘 Troubleshooting

### Port already in use

```bash
# Check what's using port 80
sudo lsof -i :80

# Kill the process
sudo kill -9 [PID]
```

### Container won't start

```bash
# Check logs
docker compose logs [service-name]

# Remove and recreate
docker compose down
docker compose up -d
```

### Database connection error

```bash
# Check PostgreSQL is running
docker compose ps postgres

# Check connection from app
docker compose exec app php artisan db:show

# Restart PostgreSQL
docker compose restart postgres
```

### Out of disk space

```bash
# Clean Docker
docker system prune -a --volumes

# Free up space
sudo apt autoremove
sudo apt clean
```

### Permission errors in storage

```bash
# Fix permissions
docker compose exec app chmod -R 775 storage bootstrap/cache
docker compose exec app chown -R www-data:www-data storage bootstrap/cache
```

---

## 📌 Important Notes

1. **Security**: Change ALL default passwords in `.env`
2. **Backups**: Setup automated database backups (cron job)
3. **Updates**: Keep system and Docker updated
4. **Monitoring**: Setup monitoring (optional: install htop, netdata)
5. **Logs**: Regularly check logs for errors

---

## 🎯 Quick Reference

```bash
# Start everything
docker compose up -d

# Stop everything
docker compose down

# View logs
docker compose logs -f

# Access app shell
docker compose exec app sh

# Run migrations
docker compose exec app php artisan migrate

# Clear caches
docker compose exec app php artisan optimize:clear

# Backup database
docker compose exec postgres pg_dump -U postgres cbt_app > backup.sql
```

---

**Need help?** Check logs first:
```bash
docker compose logs -f app
```

Most issues can be diagnosed from the logs!
