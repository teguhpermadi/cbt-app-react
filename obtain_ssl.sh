#!/bin/bash

# 1. Start Nginx to serve ACME challenge
docker compose up -d web

# 2. Request Certificate
docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot -d cbtapp.miarridlo.sch.id

# 3. Instructions for next steps
echo "========================================================"
echo "Jika sertifikat berhasil didapatkan:"
echo "1. Edit 'docker/nginx/conf.d/app.conf' dan uncomment bagian SSL."
echo "2. Jalankan 'docker compose restart web' untuk menerapkan perubahan."
echo "========================================================"
