# VPS Setup Guide for cbtapp.miarridlo.sch.id

This guide is customized for your specific domain and VPS.

**Domain:** `cbtapp.miarridlo.sch.id`
**VPS IP:** `72.61.143.156`

---

## 1. DNS Configuration

Login to your domain registrar (where you bought `miarridlo.sch.id`) and go to DNS Management. Add these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `cbtapp` | `72.61.143.156` | Automatic / 3600 |
| **A** | `www.cbtapp` | `72.61.143.156` | Automatic / 3600 |

> **Note:** Wait a few minutes (up to 24 hours) for these changes to take effect globally. You can check by running `ping cbtapp.miarridlo.sch.id` in your terminal.

---

## 2. Server Setup (VPS)

SSH into your VPS:
```bash
ssh root@72.61.143.156
```

### Install Docker (If not installed)
```bash
# Update and install basics
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Clone Request
```bash
# Go to web folder (or create one)
mkdir -p /var/www
cd /var/www

# Clone your repository (Change this URL to your actual git repo)
git clone https://github.com/teguhpermadi/cbt-app-react.git cbt-app
cd cbt-app
```

---

## 3. Configuration (.env)

Create your production environment file:

```bash
cp .env.example .env
nano .env
```

**CRITICAL: Update these specific lines in your `.env` file:**

```env
APP_NAME="CBT Miarridlo"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://cbtapp.miarridlo.sch.id

# Reverb (WebSocket) Configuration
REVERB_APP_ID=my-app-id
REVERB_APP_KEY=my-app-key
REVERB_APP_SECRET=my-app-secret
REVERB_HOST="cbtapp.miarridlo.sch.id"
REVERB_PORT=443
REVERB_SCHEME=https

# Database (Change these passwords!)
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=cbt_app
DB_USERNAME=postgres
DB_PASSWORD=SetASecurePasswordHere

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```

Save and exit (`Ctrl+X`, then `Y`, then `Enter`).

---

## 4. Launch Application

Since your `Caddyfile` is already configured to use `APP_URL`, it will automatically request an SSL certificate for `cbtapp.miarridlo.sch.id`.

```bash
# Build and start containers
docker compose up -d --build

# Generate Application Key
docker compose exec app php artisan key:generate

# Run Migrations
docker compose exec app php artisan migrate --force

# Optimize
docker compose exec app php artisan optimize
```

---

## 5. Verification

1. Open your browser and visit: [https://cbtapp.miarridlo.sch.id](https://cbtapp.miarridlo.sch.id)
2. You should see your application running with a secure HTTPS lock icon.
