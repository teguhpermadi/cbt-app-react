# Docker commands for CBT Application
# Usage: make [command]

.PHONY: help build up down restart logs shell migrate seed fresh test clean

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)CBT Application - Docker Commands$(NC)"
	@echo ""
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

build: ## Build Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	docker-compose build --no-cache

up: ## Start all services
	@echo "$(BLUE)Starting services...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)Services started! Access the app at http://localhost$(NC)"

up-dev: ## Start all services in development mode
	@echo "$(BLUE)Starting development services...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	@echo "$(GREEN)Development services started!$(NC)"
	@echo "$(GREEN)App: http://localhost:8000$(NC)"
	@echo "$(GREEN)Vite: http://localhost:5173$(NC)"
	@echo "$(GREEN)pgAdmin: http://localhost:5050$(NC)"
	@echo "$(GREEN)Redis Commander: http://localhost:8081$(NC)"

down: ## Stop all services
	@echo "$(YELLOW)Stopping services...$(NC)"
	docker-compose down

restart: ## Restart all services
	@echo "$(YELLOW)Restarting services...$(NC)"
	docker-compose restart

logs: ## Show logs from all services
	docker-compose logs -f

logs-app: ## Show logs from app service
	docker-compose logs -f app

logs-queue: ## Show logs from queue service
	docker-compose logs -f queue

shell: ## Access app container shell
	docker-compose exec app sh

shell-postgres: ## Access PostgreSQL container shell
	docker-compose exec postgres psql -U postgres -d cbt_app

shell-redis: ## Access Redis CLI
	docker-compose exec redis redis-cli

migrate: ## Run database migrations
	@echo "$(BLUE)Running migrations...$(NC)"
	docker-compose exec app php artisan migrate --force

migrate-fresh: ## Fresh migration (WARNING: will drop all tables)
	@echo "$(YELLOW)Running fresh migration...$(NC)"
	docker-compose exec app php artisan migrate:fresh --force

seed: ## Run database seeders
	@echo "$(BLUE)Running seeders...$(NC)"
	docker-compose exec app php artisan db:seed --force

fresh: ## Fresh install with migrations and seeders
	@echo "$(BLUE)Fresh installation...$(NC)"
	docker-compose exec app php artisan migrate:fresh --seed --force
	@echo "$(GREEN)Fresh installation completed!$(NC)"

optimize: ## Optimize Laravel caches
	@echo "$(BLUE)Optimizing caches...$(NC)"
	docker-compose exec app php artisan config:cache
	docker-compose exec app php artisan route:cache
	docker-compose exec app php artisan view:cache
	@echo "$(GREEN)Optimization completed!$(NC)"

clear: ## Clear all Laravel caches
	@echo "$(YELLOW)Clearing caches...$(NC)"
	docker-compose exec app php artisan config:clear
	docker-compose exec app php artisan route:clear
	docker-compose exec app php artisan view:clear
	docker-compose exec app php artisan cache:clear
	@echo "$(GREEN)Caches cleared!$(NC)"

test: ## Run tests
	docker-compose exec app php artisan test

queue-work: ## Start queue worker
	docker-compose exec app php artisan queue:work --verbose

tinker: ## Open Laravel Tinker
	docker-compose exec app php artisan tinker

npm-install: ## Install NPM dependencies
	docker-compose exec app npm install

npm-build: ## Build frontend assets
	docker-compose exec app npm run build

clean: ## Clean up containers, volumes, and images
	@echo "$(YELLOW)Cleaning up...$(NC)"
	docker-compose down -v
	docker system prune -f
	@echo "$(GREEN)Cleanup completed!$(NC)"

status: ## Show status of all services
	docker-compose ps

init: ## Initialize project (first time setup)
	@echo "$(BLUE)Initializing project...$(NC)"
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)Creating .env file...$(NC)"; \
		cp .env.docker .env; \
	fi
	@echo "$(YELLOW)Please update .env file with your configuration$(NC)"
	@echo "$(BLUE)Building images...$(NC)"
	docker-compose build
	@echo "$(BLUE)Starting services...$(NC)"
	docker-compose up -d
	@echo "$(BLUE)Waiting for services to be ready...$(NC)"
	@sleep 10
	@echo "$(BLUE)Running migrations...$(NC)"
	docker-compose exec app php artisan key:generate
	docker-compose exec app php artisan migrate --force
	@echo "$(GREEN)Project initialized! Access at http://localhost$(NC)"

backup-db: ## Backup PostgreSQL database
	@echo "$(BLUE)Backing up database...$(NC)"
	docker-compose exec postgres pg_dump -U postgres cbt_app > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Database backup completed!$(NC)"

restore-db: ## Restore PostgreSQL database (Usage: make restore-db FILE=backup.sql)
	@echo "$(YELLOW)Restoring database from $(FILE)...$(NC)"
	docker-compose exec -T postgres psql -U postgres -d cbt_app < $(FILE)
	@echo "$(GREEN)Database restored!$(NC)"
